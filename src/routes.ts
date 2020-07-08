import express from "express";
import userRoutes from "@routes/user.routes";
import uploadRoutes from "@routes/upload.routes";
import sessionRoutes from "@routes/session.routes";
import postRoutes from "@routes/post.routes";
import commentRoutes from "@routes/comment.routes";
import followersRoutes from "@routes/followers.routes";

const routes = express();

routes.use("/post", postRoutes);
routes.use("/comment", commentRoutes);
routes.use("/followers", followersRoutes);
routes.use("/users", userRoutes);
routes.use("/session", sessionRoutes);
routes.use("/uploads", uploadRoutes);

export default routes;
