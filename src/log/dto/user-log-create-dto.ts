import { UserLogAction } from "../enum/user-log-action.enum";
import { UserLogModule } from "../enum/user-log-module.enum";
import { UserLogBy } from "../interfaces/user-log-by.interface";
import { UserLogHistory } from "../interfaces/user-log-history.interface";

export class UserLogCreateDto {
    module: UserLogModule;
    moduleId?: string;
    action: UserLogAction;
    by?: UserLogBy;
    request?: any;
    history?: UserLogHistory;
    meta?: any;
}
