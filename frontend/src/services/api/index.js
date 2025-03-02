import { authApi } from './auth';
import { jobPostsApi } from './jobPosts';
import { applicationsApi } from './applications';
import { storageApi } from './storage';

export const api = {
  ...authApi,
  ...jobPostsApi,
  ...applicationsApi,
  ...storageApi
};