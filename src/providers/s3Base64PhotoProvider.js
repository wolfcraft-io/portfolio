class s3Base64PhotoProvider {
    constructor(s3Client) {
        this._client = s3Client;
    }

    async downloadPhoto(bucket, key) {
        try {
            const responsePromise = this._client
            .getObject({ Bucket: bucket, Key: key })
            .promise();
            const { Body, ContentType } = await responsePromise;

            return `data:${ContentType};base64, ${Body.toString('base64')}`
        }
        catch {
            return null;
        }

    }
}

export default s3Base64PhotoProvider;