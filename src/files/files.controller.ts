import {
    Body,
    Controller,
    Post,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ApimGuard } from 'src/auth/guards/apim.guard';
import { FilesService } from './files.service';
import * as path from 'path';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';

const FileFilter = (req, file: Express.Multer.File, callback) => {
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
        return callback(new Error(`Invalid file type: ${file.mimetype}`), false);
    }

    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!['.jpeg', '.jpg', '.png'].includes(fileExt)) {
        return callback(new Error(`Invalid file type: ${fileExt}`), false);
    }

    if (file.size > 3 * 1024 * 1024) {
        return callback(new Error('File size muste be less than 3mb'), false);
    }

    return callback(null, true);
};

class FilesDto {
    @ApiProperty({
        type: 'multipart/form-data',
        required: true,
        isArray: true,
        items: {
            type: 'string',
            format: 'binary',
        },
    })
    files: any;
}

@ApiTags('files')
@Controller('files')
@UseGuards(ApimGuard, RolesGuard)
export class FilesController {
    constructor(private filesService: FilesService) { }

    @Post('users')
    @Roles([Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR])
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FilesInterceptor(
            'files',
            20,
            {
                fileFilter: FileFilter,
            }
        )
    )
    @ApiOperation({
        summary: 'Upload user document files',
        description: `Upload array of files for user documents.`
    })
    async uploadFileArrayForUserDocuments(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Req() req,
        @Body() filesDto: FilesDto,
    ): Promise<string[]> {
        return await this.filesService.saveFiles(files, 'portal', 'users', req);
    }

    @Post('games')
    @Roles([Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR])
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FilesInterceptor(
            'files',
            20,
            {
                fileFilter: FileFilter,
            }
        )
    )
    @ApiOperation({
        summary: 'Upload game image files',
        description: `Upload array of files for game image.`
    })
    async uploadFileArrayForGameImage(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Req() req,
        @Body() filesDto: FilesDto,
    ): Promise<string[]> {
        return await this.filesService.saveFiles(files, 'games', 'images', req);
    }
}