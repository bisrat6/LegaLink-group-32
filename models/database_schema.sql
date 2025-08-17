--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

-- Started on 2025-08-17 15:41:20

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 238 (class 1255 OID 24732)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 24836)
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    appointment_id integer NOT NULL,
    case_id integer,
    client_id integer NOT NULL,
    lawyer_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    appointment_type character varying(20) DEFAULT 'consultation'::character varying,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    duration_minutes integer,
    location character varying(500),
    meeting_url character varying(500),
    status character varying(20) DEFAULT 'scheduled'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT appointments_appointment_type_check CHECK (((appointment_type)::text = ANY ((ARRAY['consultation'::character varying, 'follow_up'::character varying, 'court_hearing'::character varying, 'document_review'::character varying, 'other'::character varying])::text[]))),
    CONSTRAINT appointments_status_check CHECK (((status)::text = ANY ((ARRAY['scheduled'::character varying, 'confirmed'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'cancelled'::character varying, 'no_show'::character varying])::text[])))
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 24835)
-- Name: appointments_appointment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.appointments_appointment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.appointments_appointment_id_seq OWNER TO postgres;

--
-- TOC entry 3566 (class 0 OID 0)
-- Dependencies: 224
-- Name: appointments_appointment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.appointments_appointment_id_seq OWNED BY public.appointments.appointment_id;


--
-- TOC entry 237 (class 1259 OID 41098)
-- Name: case_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.case_applications (
    application_id integer NOT NULL,
    case_id integer NOT NULL,
    lawyer_id integer NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    applied_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    message text,
    CONSTRAINT case_applications_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'rejected'::character varying])::text[])))
);


ALTER TABLE public.case_applications OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 41097)
-- Name: case_applications_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.case_applications_application_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.case_applications_application_id_seq OWNER TO postgres;

--
-- TOC entry 3567 (class 0 OID 0)
-- Dependencies: 236
-- Name: case_applications_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.case_applications_application_id_seq OWNED BY public.case_applications.application_id;


--
-- TOC entry 223 (class 1259 OID 24804)
-- Name: cases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cases (
    case_id integer NOT NULL,
    client_id integer NOT NULL,
    lawyer_id integer,
    title character varying(255) NOT NULL,
    description text,
    case_type character varying(100),
    status character varying(20) DEFAULT 'open'::character varying,
    priority character varying(10) DEFAULT 'medium'::character varying,
    estimated_duration character varying(100),
    budget_range character varying(100),
    court_name character varying(200),
    case_number character varying(100),
    filing_date date,
    deadline_date date,
    outcome text,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cases_priority_check CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))),
    CONSTRAINT cases_status_check CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'in_progress'::character varying, 'pending_review'::character varying, 'closed'::character varying, 'cancelled'::character varying])::text[]))),
    CONSTRAINT open_cases_no_lawyer CHECK ((NOT (((status)::text = 'open'::text) AND (lawyer_id IS NOT NULL))))
);


ALTER TABLE public.cases OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 24803)
-- Name: cases_case_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cases_case_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cases_case_id_seq OWNER TO postgres;

--
-- TOC entry 3568 (class 0 OID 0)
-- Dependencies: 222
-- Name: cases_case_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cases_case_id_seq OWNED BY public.cases.case_id;


--
-- TOC entry 229 (class 1259 OID 24912)
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    document_id integer NOT NULL,
    case_id integer,
    uploaded_by integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    file_name character varying(255) NOT NULL,
    file_path character varying(500) NOT NULL,
    file_size bigint,
    file_type character varying(100),
    document_type character varying(20) DEFAULT 'other'::character varying,
    is_public boolean DEFAULT false,
    is_archived boolean DEFAULT false,
    version_number integer DEFAULT 1,
    parent_document_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT documents_document_type_check CHECK (((document_type)::text = ANY ((ARRAY['contract'::character varying, 'evidence'::character varying, 'court_filing'::character varying, 'correspondence'::character varying, 'legal_brief'::character varying, 'other'::character varying])::text[])))
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 24911)
-- Name: documents_document_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documents_document_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.documents_document_id_seq OWNER TO postgres;

--
-- TOC entry 3569 (class 0 OID 0)
-- Dependencies: 228
-- Name: documents_document_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documents_document_id_seq OWNED BY public.documents.document_id;


--
-- TOC entry 217 (class 1259 OID 24738)
-- Name: lawyer_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lawyer_profiles (
    profile_id integer NOT NULL,
    user_id integer NOT NULL,
    license_number character varying(100) NOT NULL,
    bar_association character varying(200),
    years_of_experience integer DEFAULT 0,
    hourly_rate numeric(10,2),
    consultation_fee numeric(10,2),
    bio text,
    education text,
    certifications text,
    languages_spoken text,
    availability_schedule jsonb,
    average_rating numeric(3,2) DEFAULT 0.00,
    total_reviews integer DEFAULT 0,
    is_verified boolean DEFAULT false,
    verification_documents jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lawyer_profiles OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 24737)
-- Name: lawyer_profiles_profile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lawyer_profiles_profile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lawyer_profiles_profile_id_seq OWNER TO postgres;

--
-- TOC entry 3570 (class 0 OID 0)
-- Dependencies: 216
-- Name: lawyer_profiles_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lawyer_profiles_profile_id_seq OWNED BY public.lawyer_profiles.profile_id;


--
-- TOC entry 221 (class 1259 OID 24779)
-- Name: lawyer_specializations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lawyer_specializations (
    lawyer_specialization_id integer NOT NULL,
    profile_id integer NOT NULL,
    specialization_id integer NOT NULL,
    years_experience_in_specialization integer DEFAULT 0,
    is_primary boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lawyer_specializations OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 24778)
-- Name: lawyer_specializations_lawyer_specialization_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lawyer_specializations_lawyer_specialization_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lawyer_specializations_lawyer_specialization_id_seq OWNER TO postgres;

--
-- TOC entry 3571 (class 0 OID 0)
-- Dependencies: 220
-- Name: lawyer_specializations_lawyer_specialization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lawyer_specializations_lawyer_specialization_id_seq OWNED BY public.lawyer_specializations.lawyer_specialization_id;


--
-- TOC entry 227 (class 1259 OID 24873)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    message_id integer NOT NULL,
    case_id integer,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    subject character varying(255),
    message_text text NOT NULL,
    message_type character varying(10) DEFAULT 'text'::character varying,
    is_read boolean DEFAULT false,
    read_at timestamp without time zone,
    parent_message_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT messages_message_type_check CHECK (((message_type)::text = ANY ((ARRAY['text'::character varying, 'file'::character varying, 'system'::character varying])::text[])))
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 24872)
-- Name: messages_message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.messages_message_id_seq OWNER TO postgres;

--
-- TOC entry 3572 (class 0 OID 0)
-- Dependencies: 226
-- Name: messages_message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_message_id_seq OWNED BY public.messages.message_id;


--
-- TOC entry 235 (class 1259 OID 25023)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    notification_id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    notification_type character varying(20) DEFAULT 'system'::character varying,
    is_read boolean DEFAULT false,
    read_at timestamp without time zone,
    related_entity_type character varying(50),
    related_entity_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT notifications_notification_type_check CHECK (((notification_type)::text = ANY ((ARRAY['appointment'::character varying, 'message'::character varying, 'case_update'::character varying, 'payment'::character varying, 'system'::character varying])::text[])))
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 25022)
-- Name: notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_notification_id_seq OWNER TO postgres;

--
-- TOC entry 3573 (class 0 OID 0)
-- Dependencies: 234
-- Name: notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_notification_id_seq OWNED BY public.notifications.notification_id;


--
-- TOC entry 233 (class 1259 OID 24985)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    case_id integer,
    client_id integer NOT NULL,
    lawyer_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying,
    payment_type character varying(20) DEFAULT 'consultation'::character varying,
    status character varying(20) DEFAULT 'pending'::character varying,
    payment_method character varying(100),
    transaction_id character varying(255),
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payments_payment_type_check CHECK (((payment_type)::text = ANY ((ARRAY['consultation'::character varying, 'retainer'::character varying, 'hourly'::character varying, 'flat_fee'::character varying, 'other'::character varying])::text[]))),
    CONSTRAINT payments_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'completed'::character varying, 'failed'::character varying, 'refunded'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 24984)
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payments_payment_id_seq OWNER TO postgres;

--
-- TOC entry 3574 (class 0 OID 0)
-- Dependencies: 232
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- TOC entry 231 (class 1259 OID 24950)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    case_id integer,
    reviewer_id integer NOT NULL,
    reviewed_lawyer_id integer NOT NULL,
    rating integer NOT NULL,
    title character varying(255),
    review_text text,
    is_anonymous boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 24949)
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reviews_review_id_seq OWNER TO postgres;

--
-- TOC entry 3575 (class 0 OID 0)
-- Dependencies: 230
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- TOC entry 219 (class 1259 OID 24766)
-- Name: specializations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.specializations (
    specialization_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    category character varying(100),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.specializations OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24765)
-- Name: specializations_specialization_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.specializations_specialization_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.specializations_specialization_id_seq OWNER TO postgres;

--
-- TOC entry 3576 (class 0 OID 0)
-- Dependencies: 218
-- Name: specializations_specialization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.specializations_specialization_id_seq OWNED BY public.specializations.specialization_id;


--
-- TOC entry 215 (class 1259 OID 24715)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    phone character varying(20),
    date_of_birth date,
    address text,
    city character varying(100),
    state character varying(50),
    zip_code character varying(20),
    country character varying(100) DEFAULT 'USA'::character varying,
    role character varying(20) DEFAULT 'client'::character varying NOT NULL,
    is_verified boolean DEFAULT false,
    is_active boolean DEFAULT true,
    profile_picture_url character varying(500),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    password_changed_at timestamp without time zone,
    password_reset_token text,
    password_reset_expires timestamp without time zone,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['client'::character varying, 'lawyer'::character varying, 'admin'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 24714)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 3577 (class 0 OID 0)
-- Dependencies: 214
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 3255 (class 2604 OID 24839)
-- Name: appointments appointment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments ALTER COLUMN appointment_id SET DEFAULT nextval('public.appointments_appointment_id_seq'::regclass);


--
-- TOC entry 3286 (class 2604 OID 41101)
-- Name: case_applications application_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_applications ALTER COLUMN application_id SET DEFAULT nextval('public.case_applications_application_id_seq'::regclass);


--
-- TOC entry 3250 (class 2604 OID 24807)
-- Name: cases case_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases ALTER COLUMN case_id SET DEFAULT nextval('public.cases_case_id_seq'::regclass);


--
-- TOC entry 3264 (class 2604 OID 24915)
-- Name: documents document_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents ALTER COLUMN document_id SET DEFAULT nextval('public.documents_document_id_seq'::regclass);


--
-- TOC entry 3236 (class 2604 OID 24741)
-- Name: lawyer_profiles profile_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lawyer_profiles ALTER COLUMN profile_id SET DEFAULT nextval('public.lawyer_profiles_profile_id_seq'::regclass);


--
-- TOC entry 3246 (class 2604 OID 24782)
-- Name: lawyer_specializations lawyer_specialization_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lawyer_specializations ALTER COLUMN lawyer_specialization_id SET DEFAULT nextval('public.lawyer_specializations_lawyer_specialization_id_seq'::regclass);


--
-- TOC entry 3260 (class 2604 OID 24876)
-- Name: messages message_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN message_id SET DEFAULT nextval('public.messages_message_id_seq'::regclass);


--
-- TOC entry 3282 (class 2604 OID 25026)
-- Name: notifications notification_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.notifications_notification_id_seq'::regclass);


--
-- TOC entry 3276 (class 2604 OID 24988)
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- TOC entry 3271 (class 2604 OID 24953)
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- TOC entry 3243 (class 2604 OID 24769)
-- Name: specializations specialization_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specializations ALTER COLUMN specialization_id SET DEFAULT nextval('public.specializations_specialization_id_seq'::regclass);


--
-- TOC entry 3229 (class 2604 OID 24718)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 3340 (class 2606 OID 24849)
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (appointment_id);


--
-- TOC entry 3385 (class 2606 OID 57482)
-- Name: case_applications case_applications_case_lawyer_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_applications
    ADD CONSTRAINT case_applications_case_lawyer_unique UNIQUE (case_id, lawyer_id);


--
-- TOC entry 3387 (class 2606 OID 41107)
-- Name: case_applications case_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_applications
    ADD CONSTRAINT case_applications_pkey PRIMARY KEY (application_id);


--
-- TOC entry 3332 (class 2606 OID 24817)
-- Name: cases cases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_pkey PRIMARY KEY (case_id);


--
-- TOC entry 3356 (class 2606 OID 24926)
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (document_id);


--
-- TOC entry 3315 (class 2606 OID 24753)
-- Name: lawyer_profiles lawyer_profiles_license_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lawyer_profiles
    ADD CONSTRAINT lawyer_profiles_license_number_key UNIQUE (license_number);


--
-- TOC entry 3317 (class 2606 OID 24751)
-- Name: lawyer_profiles lawyer_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lawyer_profiles
    ADD CONSTRAINT lawyer_profiles_pkey PRIMARY KEY (profile_id);


--
-- TOC entry 3319 (class 2606 OID 57488)
-- Name: lawyer_profiles lawyer_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lawyer_profiles
    ADD CONSTRAINT lawyer_profiles_user_id_key UNIQUE (user_id);


--
-- TOC entry 3328 (class 2606 OID 24787)
-- Name: lawyer_specializations lawyer_specializations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lawyer_specializations
    ADD CONSTRAINT lawyer_specializations_pkey PRIMARY KEY (lawyer_specialization_id);


--
-- TOC entry 3330 (class 2606 OID 24789)
-- Name: lawyer_specializations lawyer_specializations_profile_id_specialization_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lawyer_specializations
    ADD CONSTRAINT lawyer_specializations_profile_id_specialization_id_key UNIQUE (profile_id, specialization_id);


--
-- TOC entry 3354 (class 2606 OID 24884)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (message_id);


--
-- TOC entry 3383 (class 2606 OID 25034)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- TOC entry 3377 (class 2606 OID 24999)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 3369 (class 2606 OID 24962)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- TOC entry 3321 (class 2606 OID 24777)
-- Name: specializations specializations_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specializations
    ADD CONSTRAINT specializations_name_key UNIQUE (name);


--
-- TOC entry 3323 (class 2606 OID 24775)
-- Name: specializations specializations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specializations
    ADD CONSTRAINT specializations_pkey PRIMARY KEY (specialization_id);


--
-- TOC entry 3306 (class 2606 OID 24731)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3308 (class 2606 OID 24729)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3341 (class 1259 OID 24871)
-- Name: idx_appointments_appointment_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_appointments_appointment_type ON public.appointments USING btree (appointment_type);


--
-- TOC entry 3342 (class 1259 OID 24866)
-- Name: idx_appointments_case_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_appointments_case_id ON public.appointments USING btree (case_id);


--
-- TOC entry 3343 (class 1259 OID 24867)
-- Name: idx_appointments_client_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_appointments_client_id ON public.appointments USING btree (client_id);


--
-- TOC entry 3344 (class 1259 OID 24868)
-- Name: idx_appointments_lawyer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_appointments_lawyer_id ON public.appointments USING btree (lawyer_id);


--
-- TOC entry 3345 (class 1259 OID 24869)
-- Name: idx_appointments_start_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_appointments_start_time ON public.appointments USING btree (start_time);


--
-- TOC entry 3346 (class 1259 OID 24870)
-- Name: idx_appointments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_appointments_status ON public.appointments USING btree (status);


--
-- TOC entry 3333 (class 1259 OID 24833)
-- Name: idx_cases_case_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cases_case_type ON public.cases USING btree (case_type);


--
-- TOC entry 3334 (class 1259 OID 24829)
-- Name: idx_cases_client_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cases_client_id ON public.cases USING btree (client_id);


--
-- TOC entry 3335 (class 1259 OID 24834)
-- Name: idx_cases_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cases_created_at ON public.cases USING btree (created_at);


--
-- TOC entry 3336 (class 1259 OID 24830)
-- Name: idx_cases_lawyer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cases_lawyer_id ON public.cases USING btree (lawyer_id);


--
-- TOC entry 3337 (class 1259 OID 24832)
-- Name: idx_cases_priority; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cases_priority ON public.cases USING btree (priority);


--
-- TOC entry 3338 (class 1259 OID 24831)
-- Name: idx_cases_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cases_status ON public.cases USING btree (status);


--
-- TOC entry 3357 (class 1259 OID 24943)
-- Name: idx_documents_case_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_case_id ON public.documents USING btree (case_id);


--
-- TOC entry 3358 (class 1259 OID 24948)
-- Name: idx_documents_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_created_at ON public.documents USING btree (created_at);


--
-- TOC entry 3359 (class 1259 OID 24945)
-- Name: idx_documents_document_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_document_type ON public.documents USING btree (document_type);


--
-- TOC entry 3360 (class 1259 OID 24947)
-- Name: idx_documents_is_archived; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_is_archived ON public.documents USING btree (is_archived);


--
-- TOC entry 3361 (class 1259 OID 24946)
-- Name: idx_documents_is_public; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_is_public ON public.documents USING btree (is_public);


--
-- TOC entry 3362 (class 1259 OID 24944)
-- Name: idx_documents_uploaded_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_uploaded_by ON public.documents USING btree (uploaded_by);


--
-- TOC entry 3309 (class 1259 OID 24763)
-- Name: idx_lawyer_profiles_average_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lawyer_profiles_average_rating ON public.lawyer_profiles USING btree (average_rating);


--
-- TOC entry 3310 (class 1259 OID 24762)
-- Name: idx_lawyer_profiles_hourly_rate; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lawyer_profiles_hourly_rate ON public.lawyer_profiles USING btree (hourly_rate);


--
-- TOC entry 3311 (class 1259 OID 24764)
-- Name: idx_lawyer_profiles_is_verified; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lawyer_profiles_is_verified ON public.lawyer_profiles USING btree (is_verified);


--
-- TOC entry 3312 (class 1259 OID 24760)
-- Name: idx_lawyer_profiles_license_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lawyer_profiles_license_number ON public.lawyer_profiles USING btree (license_number);


--
-- TOC entry 3313 (class 1259 OID 24761)
-- Name: idx_lawyer_profiles_years_experience; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lawyer_profiles_years_experience ON public.lawyer_profiles USING btree (years_of_experience);


--
-- TOC entry 3324 (class 1259 OID 24802)
-- Name: idx_lawyer_specializations_is_primary; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lawyer_specializations_is_primary ON public.lawyer_specializations USING btree (is_primary);


--
-- TOC entry 3325 (class 1259 OID 24800)
-- Name: idx_lawyer_specializations_profile_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lawyer_specializations_profile_id ON public.lawyer_specializations USING btree (profile_id);


--
-- TOC entry 3326 (class 1259 OID 24801)
-- Name: idx_lawyer_specializations_specialization_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lawyer_specializations_specialization_id ON public.lawyer_specializations USING btree (specialization_id);


--
-- TOC entry 3347 (class 1259 OID 24905)
-- Name: idx_messages_case_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_case_id ON public.messages USING btree (case_id);


--
-- TOC entry 3348 (class 1259 OID 24909)
-- Name: idx_messages_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_created_at ON public.messages USING btree (created_at);


--
-- TOC entry 3349 (class 1259 OID 24908)
-- Name: idx_messages_is_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_is_read ON public.messages USING btree (is_read);


--
-- TOC entry 3350 (class 1259 OID 24910)
-- Name: idx_messages_parent_message_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_parent_message_id ON public.messages USING btree (parent_message_id);


--
-- TOC entry 3351 (class 1259 OID 24907)
-- Name: idx_messages_receiver_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_receiver_id ON public.messages USING btree (receiver_id);


--
-- TOC entry 3352 (class 1259 OID 24906)
-- Name: idx_messages_sender_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_sender_id ON public.messages USING btree (sender_id);


--
-- TOC entry 3378 (class 1259 OID 25043)
-- Name: idx_notifications_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (created_at);


--
-- TOC entry 3379 (class 1259 OID 25041)
-- Name: idx_notifications_is_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_is_read ON public.notifications USING btree (is_read);


--
-- TOC entry 3380 (class 1259 OID 25042)
-- Name: idx_notifications_notification_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_notification_type ON public.notifications USING btree (notification_type);


--
-- TOC entry 3381 (class 1259 OID 25040)
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- TOC entry 3370 (class 1259 OID 25016)
-- Name: idx_payments_case_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_case_id ON public.payments USING btree (case_id);


--
-- TOC entry 3371 (class 1259 OID 25017)
-- Name: idx_payments_client_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_client_id ON public.payments USING btree (client_id);


--
-- TOC entry 3372 (class 1259 OID 25021)
-- Name: idx_payments_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_created_at ON public.payments USING btree (created_at);


--
-- TOC entry 3373 (class 1259 OID 25018)
-- Name: idx_payments_lawyer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_lawyer_id ON public.payments USING btree (lawyer_id);


--
-- TOC entry 3374 (class 1259 OID 25020)
-- Name: idx_payments_payment_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_payment_type ON public.payments USING btree (payment_type);


--
-- TOC entry 3375 (class 1259 OID 25019)
-- Name: idx_payments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_status ON public.payments USING btree (status);


--
-- TOC entry 3363 (class 1259 OID 24979)
-- Name: idx_reviews_case_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_case_id ON public.reviews USING btree (case_id);


--
-- TOC entry 3364 (class 1259 OID 24983)
-- Name: idx_reviews_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_created_at ON public.reviews USING btree (created_at);


--
-- TOC entry 3365 (class 1259 OID 24982)
-- Name: idx_reviews_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_rating ON public.reviews USING btree (rating);


--
-- TOC entry 3366 (class 1259 OID 24981)
-- Name: idx_reviews_reviewed_lawyer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_reviewed_lawyer_id ON public.reviews USING btree (reviewed_lawyer_id);


--
-- TOC entry 3367 (class 1259 OID 24980)
-- Name: idx_reviews_reviewer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_reviewer_id ON public.reviews USING btree (reviewer_id);


--
-- TOC entry 3302 (class 1259 OID 24734)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 3303 (class 1259 OID 24736)
-- Name: idx_users_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_is_active ON public.users USING btree (is_active);


--
-- TOC entry 3304 (class 1259 OID 24735)
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- TOC entry 3415 (class 2620 OID 24865)
-- Name: appointments update_appointments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3414 (class 2620 OID 24828)
-- Name: cases update_cases_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON public.cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3416 (class 2620 OID 24942)
-- Name: documents update_documents_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3413 (class 2620 OID 24759)
-- Name: lawyer_profiles update_lawyer_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_lawyer_profiles_updated_at BEFORE UPDATE ON public.lawyer_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3418 (class 2620 OID 25015)
-- Name: payments update_payments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3417 (class 2620 OID 24978)
-- Name: reviews update_reviews_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3412 (class 2620 OID 24733)
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3393 (class 2606 OID 24850)
-- Name: appointments appointments_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(case_id) ON DELETE SET NULL;


--
-- TOC entry 3394 (class 2606 OID 24855)
-- Name: appointments appointments_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3395 (class 2606 OID 24860)
-- Name: appointments appointments_lawyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_lawyer_id_fkey FOREIGN KEY (lawyer_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3410 (class 2606 OID 57493)
-- Name: case_applications case_applications_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_applications
    ADD CONSTRAINT case_applications_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(case_id) ON DELETE CASCADE;


--
-- TOC entry 3411 (class 2606 OID 57498)
-- Name: case_applications case_applications_lawyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_applications
    ADD CONSTRAINT case_applications_lawyer_id_fkey FOREIGN KEY (lawyer_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3391 (class 2606 OID 24818)
-- Name: cases cases_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3392 (class 2606 OID 24823)
-- Name: cases cases_lawyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_lawyer_id_fkey FOREIGN KEY (lawyer_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- TOC entry 3400 (class 2606 OID 24927)
-- Name: documents documents_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(case_id) ON DELETE SET NULL;


--
-- TOC entry 3401 (class 2606 OID 24937)
-- Name: documents documents_parent_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_parent_document_id_fkey FOREIGN KEY (parent_document_id) REFERENCES public.documents(document_id) ON DELETE SET NULL;


--
-- TOC entry 3402 (class 2606 OID 24932)
-- Name: documents documents_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3388 (class 2606 OID 24754)
-- Name: lawyer_profiles lawyer_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lawyer_profiles
    ADD CONSTRAINT lawyer_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3389 (class 2606 OID 24790)
-- Name: lawyer_specializations lawyer_specializations_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lawyer_specializations
    ADD CONSTRAINT lawyer_specializations_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.lawyer_profiles(profile_id) ON DELETE CASCADE;


--
-- TOC entry 3390 (class 2606 OID 24795)
-- Name: lawyer_specializations lawyer_specializations_specialization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lawyer_specializations
    ADD CONSTRAINT lawyer_specializations_specialization_id_fkey FOREIGN KEY (specialization_id) REFERENCES public.specializations(specialization_id) ON DELETE CASCADE;


--
-- TOC entry 3396 (class 2606 OID 24885)
-- Name: messages messages_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(case_id) ON DELETE SET NULL;


--
-- TOC entry 3397 (class 2606 OID 24900)
-- Name: messages messages_parent_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_parent_message_id_fkey FOREIGN KEY (parent_message_id) REFERENCES public.messages(message_id) ON DELETE SET NULL;


--
-- TOC entry 3398 (class 2606 OID 24895)
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3399 (class 2606 OID 24890)
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3409 (class 2606 OID 25035)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3406 (class 2606 OID 25000)
-- Name: payments payments_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(case_id) ON DELETE SET NULL;


--
-- TOC entry 3407 (class 2606 OID 25005)
-- Name: payments payments_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3408 (class 2606 OID 25010)
-- Name: payments payments_lawyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_lawyer_id_fkey FOREIGN KEY (lawyer_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3403 (class 2606 OID 24963)
-- Name: reviews reviews_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(case_id) ON DELETE SET NULL;


--
-- TOC entry 3404 (class 2606 OID 24973)
-- Name: reviews reviews_reviewed_lawyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewed_lawyer_id_fkey FOREIGN KEY (reviewed_lawyer_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3405 (class 2606 OID 24968)
-- Name: reviews reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2025-08-17 15:41:20

--
-- PostgreSQL database dump complete
--

