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

    unloadedPhotosList = null;
    isFetchingPhoto = false;

    async getClient() {
        await credentials.getPromise();
        return new S3({ credentials, region });
    }
   
    async populatePhotoList() {
        if (this.unloadedPhotosList === POPULATING_LIST)
            return await this.listIsPopulated();

        this.unloadedPhotosList = POPULATING_LIST;
        const determinePosition = random.normal();
        const client = await this.getClient();
        await client
            .listObjectsV2({ Bucket: bucket })
            .promise()
            .then(({ Contents }) => {
                this.unloadedPhotosList = Contents
                    ?.map(object => object.Key)
                    .filter(key =>`${key}`.match(keyExtension))
                    .sort(() => determinePosition())
                    || [];
            })
            .catch(error => { 
                if (this.isDevelopmentMode)
                    console.error('failed to load photo list', error);
                this.unloadedPhotosList = []; 
            });
    }

    async listIsPopulated() {
        if (this.unloadedPhotosList && Array.isArray(this.unloadedPhotosList))
            return;

        return await new Promise(resolve => {
            setTimeout(async () => { 
                await this.listIsPopulated(); 
                resolve();
            }, 250);
        });
    }

    getNextPhoto = async () => {
        if (!this.unloadedPhotosList || !Array.isArray(this.unloadedPhotosList))
            await this.populatePhotoList();

        await this.canFetchNext();
        this.isFetchingPhoto = true;
        const key = this.unloadedPhotosList.shift();
        if (!key)
        {
            this.isFetchingPhoto = false;
            return null;
        }

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
            catch (error){
                if(this.isDevelopmentMode)
                    console.error('failed to load metadata', key, error);
            }
            
            this.isFetchingPhoto = false;
            return photo;

        } catch (error) {
            if(this.isDevelopmentMode)
                console.error('failed to load', key, error);

            return await this.getNextPhoto();
        }
    }

    canFetchNext = async () => {
        if(!this.isFetchingPhoto)
            return;
        
        await new Promise(r => setTimeout(r, 5));
        return await this.canFetchNext();
    }

    isDevelopmentMode = () => process.env.NODE_ENV === 'development';
}

export default S3ContentProvider;