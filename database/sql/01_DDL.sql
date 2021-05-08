CREATE SCHEMA pf
    AUTHORIZATION postgres;

-- USER TABLE

CREATE TABLE pf."user"
(
    user_id character varying(21) NOT NULL,
    email character varying(128) NOT NULL,
    first_name character varying(64),
    last_name character varying(64),
    pass_hash character varying(256) NOT NULL,
    PRIMARY KEY (user_id)
)

TABLESPACE pg_default;

ALTER TABLE pf."user"
    OWNER to postgres;

-- CLUB TABLE

CREATE TABLE pf.club
(
    club_id character varying(21) NOT NULL,
    club_name character varying(128) NOT NULL,
    club_desc character varying(4096),
    club_icon_url character varying,
    PRIMARY KEY (club_id)
);

ALTER TABLE pf.club
    OWNER to postgres;

-- CLUB_MEMBER TABLE

CREATE TABLE pf.club_member
(
    club_id character varying(21) NOT NULL,
    user_id character varying(21) NOT NULL,
    club_role character varying(32) NOT NULL,
    CONSTRAINT "CLUB_MEMBER_PK_1" PRIMARY KEY (club_id, user_id)
        INCLUDE(club_id, user_id),
    CONSTRAINT "CLUB_MEMBER_FK_1" FOREIGN KEY (club_id)
        REFERENCES pf.club (club_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT "CLUB_MEMBER_FK_2" FOREIGN KEY (user_id)
        REFERENCES pf.user (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
);

ALTER TABLE pf.club_member
    OWNER to postgres;

-- CLUB_MEETING TABLE
CREATE TABLE pf.club_meeting
(
    club_id character varying(21) NOT NULL,
    meeting_timestamp timestamp with time zone NOT NULL,
    book_isbn character varying(16),
    CONSTRAINT "CLUB_MEETING_PK_1" PRIMARY KEY (club_id, meeting_timestamp)
        INCLUDE(club_id, meeting_timestamp),
    CONSTRAINT "CLUB_MEETING_FK_1" FOREIGN KEY (club_id)
        REFERENCES pf.club (club_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
);

ALTER TABLE pf.club_meeting
    OWNER to postgres;

-- BOOK_REVIEW TABLE
CREATE TABLE pf.book_review
(
    user_id character varying(21) NOT NULL,
    book_isbn character varying(16) NOT NULL,
    review_rating int NOT NULL,
    review_detail character varying(16384),
    review_timestamp timestamp with time zone NOT NULL,
    CONSTRAINT "BOOK_REVIEW_PK_1" PRIMARY KEY (user_id, book_isbn)
        INCLUDE(user_id, book_isbn),
    CONSTRAINT "BOOK_REVIEW_FK_1" FOREIGN KEY (user_id)
        REFERENCES pf."user" (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
);

ALTER TABLE pf.book_review
    OWNER to postgres;

COMMIT;