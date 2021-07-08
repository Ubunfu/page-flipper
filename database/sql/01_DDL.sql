CREATE SCHEMA pf
    AUTHORIZATION postgres;

-- USER TABLE

CREATE TABLE pf."user"
(
    "userId" character varying(21) NOT NULL,
    "email" character varying(128) NOT NULL,
    "firstName" character varying(64),
    "lastName" character varying(64),
    "passHash" character varying(256) NOT NULL,
    PRIMARY KEY ("userId")
)

TABLESPACE pg_default;

ALTER TABLE pf."user"
    OWNER to postgres;

-- CLUB TABLE

CREATE TABLE pf.club
(
    "clubId" character varying(21) NOT NULL,
    "clubName" character varying(128) NOT NULL,
    "clubDesc" character varying(4096),
    "clubIconUrl" character varying,
    PRIMARY KEY ("clubId")
);

ALTER TABLE pf.club
    OWNER to postgres;

-- CLUB_MEMBER TABLE

CREATE TABLE pf.club_member
(
    "clubId" character varying(21) NOT NULL,
    "userId" character varying(21) NOT NULL,
    "clubRole" character varying(32) NOT NULL,
    CONSTRAINT "CLUB_MEMBER_PK_1" PRIMARY KEY ("clubId", "userId")
        INCLUDE("clubId", "userId"),
    CONSTRAINT "CLUB_MEMBER_FK_1" FOREIGN KEY ("clubId")
        REFERENCES pf.club ("clubId") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT "CLUB_MEMBER_FK_2" FOREIGN KEY ("userId")
        REFERENCES pf.user ("userId") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
);

ALTER TABLE pf.club_member
    OWNER to postgres;

-- CLUB_MEETING TABLE
CREATE TABLE pf.club_meeting
(
    "meetingId" character varying(21) NOT NULL,
    "clubId" character varying(21) NOT NULL,
    "meetingDate" date NOT NULL,
    "bookIconUrl" character varying,
    "bookTitle" character varying(128) NOT NULL,
    "bookAuthor" character varying(128) NOT NULL,
    "bookIsbn" character varying(16),
    PRIMARY KEY ("meetingId"),
    CONSTRAINT "CLUB_MEETING_FK_1" FOREIGN KEY ("clubId")
        REFERENCES pf.club ("clubId") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
);

ALTER TABLE pf.club_meeting
    OWNER to postgres;

-- CLUB_MEETING_COMMENT TABLE
CREATE TABLE pf.club_meeting_comment
(
    "commentId" character varying(21) NOT NULL,
    "meetingId" character varying(21) NOT NULL,
    "userId" character varying(21) NOT NULL,
    "commentTimestamp" int NOT NULL,
    "comment" character varying(4096) NOT NULL,
    PRIMARY KEY ("commentId"),
    CONSTRAINT "CLUB_MEETING_COMMENT_FK_1" FOREIGN KEY ("userId")
        REFERENCES pf.user ("userId") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT "CLUB_MEETING_COMMENT_FK_2" FOREIGN KEY ("meetingId")
        REFERENCES pf.club_meeting ("meetingId") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
);

ALTER TABLE pf.club_meeting_comment
    OWNER to postgres;

-- BOOK_REVIEW TABLE
CREATE TABLE pf.book_review
(
    "userId" character varying(21) NOT NULL,
    "bookIsbn" character varying(16) NOT NULL,
    "reviewRating" int NOT NULL,
    "reviewDetail" character varying(16384),
    "reviewTimestamp" timestamp with time zone NOT NULL,
    CONSTRAINT "BOOK_REVIEW_PK_1" PRIMARY KEY ("userId", "bookIsbn")
        INCLUDE("userId", "bookIsbn"),
    CONSTRAINT "BOOK_REVIEW_FK_1" FOREIGN KEY ("userId")
        REFERENCES pf."user" ("userId") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
);

ALTER TABLE pf.book_review
    OWNER to postgres;

COMMIT;