// File: src/app/api/index.ts

import api from "./client";
import * as AuthTypes from "./types/auth";
import * as PostTypes from "./types/posts";
import * as UserTypes from "./types/users";
import { userService } from "./user";

export { api as default, userService, AuthTypes, PostTypes, UserTypes };
