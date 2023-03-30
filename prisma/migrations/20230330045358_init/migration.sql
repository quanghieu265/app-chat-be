-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "avatar_url" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "friends_id" INTEGER[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_room" (
    "id" SERIAL NOT NULL,
    "users_id" INTEGER[],
    "last_message" INTEGER,
    "chatName" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_list" (
    "id" SERIAL NOT NULL,
    "sender" INTEGER NOT NULL,
    "reader" INTEGER NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "tag" VARCHAR(255) NOT NULL,
    "chat_room_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_list_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
