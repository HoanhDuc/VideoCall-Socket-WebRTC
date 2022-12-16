import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './user/index'
import socketsReducer from './socket/index'

export const store = configureStore({
  reducer: {
    auth: usersReducer,
    socket: socketsReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}