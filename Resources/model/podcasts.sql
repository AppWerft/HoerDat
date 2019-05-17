CREATE TABLE IF NOT EXISTS "items" (
	"channelurl" TEXT NOT NULL,
	"id" Number, 
	"station" TEXT,
	"title" TEXT, 
	"author" TEXT, 
	"keywords" TEXT,
	"weblink" TEXT, 
	"description" TEXT, 
	"pubdate" TEXT,
	"depubdate" TEXT, 
	"duration" INTEGER,
	"image" TEXT,
	"position" INTEGER,
	"url" TEXT, 
	"state" INTEGER,
	"lastaccess" INTEGER, 
	"localfile" TEXT
);
CREATE INDEX IF NOT EXISTS idx_channel ON items (channelurl);
CREATE TABLE IF NOT EXISTS "channels" (
	"station" TEXT NOT NULL,
	"template" TEXT,
	"title" TEXT,
	"image" TEXT,
	"description" TEXT,
	"subscribed" INTEGER,
	"channelurl" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_station ON channels (station	)	
	