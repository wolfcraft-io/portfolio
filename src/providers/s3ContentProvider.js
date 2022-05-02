import { Credentials } from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';
import random from 'random';
import s3Base64PhotoProvider from './s3Base64PhotoProvider';
import hash from 'object-hash';

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
            const base64PhotoProvider = new s3Base64PhotoProvider(client);
            const base64Image = await base64PhotoProvider.downloadPhoto(bucket, key);
            if (!base64Image)
                return await this.getNextPhoto();

            const photo = { 
                name: key,
                hash: hash(key, {algorithm: 'md5'}),
                image: base64Image,
                loadFullsize: async () => await base64PhotoProvider.downloadPhoto(bucket, key.replace(keyExtension, '.H_1296.jpg')),
                loadFullsize4K: async () => await base64PhotoProvider.downloadPhoto(bucket, key.replace(keyExtension, '.H_1800.jpg'))
            };
    
            try
            {
                const metaDataResponse = client
                    .getObject({ Bucket: bucket, Key: key.replace(keyExtension, '.meta.json')})
                    .promise();
                const { Body } = await metaDataResponse;
                const { description, labels = [] } = JSON.parse(Body.toString());
                photo.labels = labels;
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