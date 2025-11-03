import { AdminServices } from '../src/app/modules/admin/Admin.service';

AdminServices.seed().then(() => process.exit(0));
