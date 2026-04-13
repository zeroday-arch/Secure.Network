CREATE TABLE `discordProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`discordId` varchar(64) NOT NULL,
	`discordUsername` varchar(255),
	`discordAvatar` text,
	`roles` text,
	`isVip` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `discordProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `discordProfiles_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `discordProfiles_discordId_unique` UNIQUE(`discordId`)
);
