import { Credentials } from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';
import random from 'random';

const POPULATING_LIST = 'POPULATING_LIST';

const bucket = process.env.REACT_APP_S3_BUCKET;
const region = process.env.REACT_APP_S3_REGION;
const credentials = new Credentials(
    process.env.REACT_APP_S3_ID,
    process.env.REACT_APP_S3_SECRET
);

const keyExtension = /\.W_900\.jpe?g$/gi;

class S3ContentProvider {

    async getClient() {
        await credentials.getPromise();
        return new S3({ credentials, region });
    }
   
    async populatePhotoList() {
        if (this.photoList === POPULATING_LIST)
            return await this.listIsPopulated();

        this.photoList = POPULATING_LIST;
        const determinePosition = random.normal();
        const client = await this.getClient();
        await client
            .listObjectsV2({ Bucket: bucket })
            .promise()
            .then(({ Contents }) => {
                this.photoList = Contents
                    ?.map(object => object.Key)
                    .filter(key =>`${key}`.match(keyExtension))
                    .sort(() => determinePosition())
                    || [];
            })
            .catch(error => { 
                console.error(error);
                this.photoList = []; 
            });
    }

    async listIsPopulated() {
        if (this.photoList && Array.isArray(this.photoList))
            return;

        return await new Promise(resolve => {
            setTimeout(async () => { 
                await this.listIsPopulated(); 
                resolve();
            }, 250);
        });
    }

    getNextPhoto = async () => {
        if (!this.photoList || !Array.isArray(this.photoList))
            await this.populatePhotoList();

        const key = this.photoList.shift();
        if (!key)
            return null;

        try {
            const client = await this.getClient();
            const responsePromise = client
                .getObject({ Bucket: bucket, Key: key })
                .promise();
            const { Body, ContentType } = await responsePromise;
    
            const photo = { 
                image: `data:${ContentType};base64, ${Body.toString('base64')}`,
                name: key,
            };
    
            try
            {
                const metaDataResponse = client
                    .getObject({ Bucket: bucket, Key: key.replace(keyExtension, '.meta.json')})
                    .promise();
                const { Body } = await metaDataResponse;
                const { description } = JSON.parse(Body.toString());
                if (description)
                    photo.description = description
            }
            catch {}
            
            return photo;

        } catch {
            return await this.getNextPhoto();
        }
    }
}

export default S3ContentProvider;