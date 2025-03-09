-- 1⃣ Roles Table
CREATE TABLE IF NOT EXISTS roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(30) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 2⃣ Users Table (For Business Owners and Employees)
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_first_name VARCHAR(255) NOT NULL,
  user_last_name VARCHAR(255) NOT NULL,
  user_phone_number VARCHAR(255) NULL,
  role_id INT DEFAULT 1,
  active_user_status TINYINT DEFAULT 1,
  user_added_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  user_pass VARCHAR(255) NOT NULL,
  user_img VARCHAR(255) NULL,
  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3⃣ Business Types Table
CREATE TABLE IF NOT EXISTS business_types (
  type_id INT AUTO_INCREMENT PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 4⃣ Businesses Table (Owned by users)
CREATE TABLE IF NOT EXISTS businesses (
  business_id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  business_name VARCHAR(150) NOT NULL,
  type_id INT NOT NULL,
  tin_number VARCHAR(20) UNIQUE NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (type_id) REFERENCES business_types(type_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5⃣ Business Reviewers (Many-to-Many: Employees Reviewing Businesses)
CREATE TABLE IF NOT EXISTS business_reviewers (
  business_id INT NOT NULL,
  reviewer_id INT NOT NULL,
  review_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (business_id, reviewer_id),
  FOREIGN KEY (business_id) REFERENCES businesses(business_id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6⃣ Statuses Table (For Applications & Licenses Only)
CREATE TABLE IF NOT EXISTS statuses (
  status_id INT AUTO_INCREMENT PRIMARY KEY,
  status_name VARCHAR(30) NOT NULL,
  status_type ENUM('application', 'license') NOT NULL,
  UNIQUE (status_name, status_type)
) ENGINE=InnoDB;

-- 7⃣ Applications Table (Owned by users, reviewed by employees)
CREATE TABLE IF NOT EXISTS applications (
  application_id INT AUTO_INCREMENT PRIMARY KEY,
  business_id INT NOT NULL,
  owner_id INT NOT NULL,
  status_id INT DEFAULT 1,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  comments TEXT NULL,
  FOREIGN KEY (business_id) REFERENCES businesses(business_id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (status_id) REFERENCES statuses(status_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 8⃣ Application Documents Table
CREATE TABLE IF NOT EXISTS application_documents (
  document_id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_img VARCHAR(255) NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9⃣ Licenses Table (Issued after approval)
CREATE TABLE IF NOT EXISTS licenses (
  license_id INT AUTO_INCREMENT PRIMARY KEY,
  business_id INT NOT NULL,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  issued_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status_id INT DEFAULT 1,
  FOREIGN KEY (business_id) REFERENCES businesses(business_id) ON DELETE CASCADE,
  FOREIGN KEY (status_id) REFERENCES statuses(status_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 🔡 Logs Table
CREATE TABLE IF NOT EXISTS logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 🔢 Insert Default Data
INSERT INTO roles (role_name) VALUES ('owner'), ('employee'), ('admin');

INSERT INTO statuses (status_name, status_type) VALUES
('pending', 'application'), ('under_review', 'application'), ('approved', 'application'), ('rejected', 'application'),
('pending', 'license'), ('active', 'license'), ('expired', 'license'), ('revoked', 'license');

INSERT INTO business_types (type_name) VALUES ('Retail'), ('Manufacturing'), ('Services'), ('Technology'), ('Trade');
