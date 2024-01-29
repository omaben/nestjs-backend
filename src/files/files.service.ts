import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { Readable } from 'readable-stream'
const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline
} = require('@azure/storage-blob');

const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT_NAME,
    process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY
);

const pipeline = newPipeline(sharedKeyCredential);

const blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    pipeline
);

const getBlobName = originalName => {
    // Use a random uuid to generate a unique file name, 

    return `${uuidv4()}-${originalName}`;
};

@Injectable()
export class FilesService {
    constructor(
    ) { }

    async saveFiles(files: Array<Express.Multer.File>, container: string, path: string, req: any): Promise<string[]> {
        const savedFiles = [];

        for (const file of files) {
            const blobName = getBlobName(file.originalname);
            const stream = Readable.from(file.buffer)
            const containerClient = blobServiceClient.getContainerClient(`${container}/${path}`);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            const uploadBlobResponse = await blockBlobClient.uploadStream(
                stream,
                3 * 1024 * 1024, // bufferSize
                20, // maxBuffers
                {
                    blobHTTPHeaders: {
                        blobContentType: file.mimetype
                    }
                });

            const url = uploadBlobResponse._response.request.url
                .replace('?comp=blocklist', '')
                .replace(/%2F/g, '/')
                .replace(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, '');

            savedFiles.push(url);
        }

        return savedFiles;
    }
}