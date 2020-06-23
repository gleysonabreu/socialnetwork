import express from "express";
import userRoutes from "@routes/user.routes";
import uploadRoutes from "@routes/upload.routes";
import sessionRoutes from "@routes/session.routes";
import postRoutes from "@routes/post.routes";
import commentRoutes from "@routes/comment.routes";
import followersRoutes from "@routes/followers.routes";

const routes = express();

routes.use(postRoutes);
routes.use(commentRoutes);
routes.use(followersRoutes);
routes.use(userRoutes);
routes.use(sessionRoutes);
routes.use(uploadRoutes);

export default routes;
