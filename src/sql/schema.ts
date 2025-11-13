export default `CREATE TABLE vendors (
    vendor_id TEXT PRIMARY KEY,
    clean_name TEXT NOT NULL,
    learn_more_url TEXT,
    eu_or_uk_regions JSON NOT NULL
);

CREATE TABLE vendor_regions (
    vendor_id TEXT NOT NULL,
    region_code TEXT,
    category TEXT,
    region_name TEXT NOT NULL,
    PRIMARY KEY (vendor_id, region_code)
);

CREATE INDEX idx_vendor_regions_vendor_id ON vendor_regions (vendor_id);

CREATE TABLE models (
    model_id TEXT PRIMARY KEY,
    clean_name TEXT NOT NULL,
    brand TEXT NOT NULL,
    company_country_code TEXT NOT NULL,
    selfhostable BOOLEAN NOT NULL,
    reasoning BOOLEAN NOT NULL,
    humanitys_last_exam_percentage REAL,
    swe_bench_resolved_percentage REAL,
    skatebench_score REAL
);

CREATE TABLE models_tokenisers (
    model_id TEXT PRIMARY KEY,
    tokeniser TEXT NOT NULL,
    url TEXT NOT NULL,
    FOREIGN KEY (model_id) REFERENCES models(model_id)
);

CREATE TABLE models_vendors (
    model_id TEXT NOT NULL,
    vendor_id TEXT NOT NULL,
    latency_ms INTEGER NOT NULL,
    tokens_per_second INTEGER NOT NULL,
    low_capacity BOOLEAN NOT NULL,
    PRIMARY KEY (model_id, vendor_id)
);

CREATE INDEX idx_models_vendors_model_id ON models_vendors (model_id);

CREATE TABLE models_vendors_regions (
    model_id TEXT NOT NULL,
    vendor_id TEXT NOT NULL,
    region_code TEXT NOT NULL,
    input_token_cost REAL NOT NULL,
    output_token_cost REAL NOT NULL,
    cached_input_token_cost REAL,
    cached_output_token_cost REAL,
    FOREIGN KEY (model_id) REFERENCES models(model_id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id),
    PRIMARY KEY (model_id, vendor_id, region_code)
);

CREATE INDEX idx_models_vendors_regions_model_id ON models_vendors_regions (model_id);
`;
