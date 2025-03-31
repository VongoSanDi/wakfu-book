import { Injectable } from '@nestjs/common';

@Injectable()
export class ResourcesService {

  findAll() {
    return `This action returns all resources`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resource`;
  }
}
