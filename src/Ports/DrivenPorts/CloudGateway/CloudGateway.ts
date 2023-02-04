import { ICloudGateway } from './CloudGateway.interface';

import { FakeCloudGateway } from '../../../Adapters/DrivenAdapters/CloudGateway/FakeCloudGateway';
import { CloudinaryCloudGateway } from '../../../Adapters/DrivenAdapters/CloudGateway/CloudinaryCloudGateway';

let cloudGateway: ICloudGateway;

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'test-e2e') {
    cloudGateway = new FakeCloudGateway();
} else {
    cloudGateway = new CloudinaryCloudGateway();
}

export { cloudGateway };
