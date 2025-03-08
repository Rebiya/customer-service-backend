CREATE DATABASE IF NOT EXISTS business_licensing;
USE business_licensing;

-- 1️⃣ User Tables (For Business Owners)
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_first_name VARCHAR(255) NOT NULL,
  user_last_name VARCHAR(255) NOT NULL,
  user_phone_number VARCHAR(255) NULL,
  Role_id INT DEFAULT 1,
  active_user_status INT NULL,
  user_added_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  user_pass VARCHAR(255) NOT NULL
  user_img VARCHAR(255) NULL,
  FOREIGN KEY (Role_id) REFERENCES Roles(Role_id)
) ENGINE=InnoDB;

-- 2️⃣ Business Tables (Stores Business Details)
CREATE TABLE IF NOT EXISTS businesses (
  business_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  business_name VARCHAR(150) NOT NULL,
  business_type VARCHAR(100) NOT NULL,
  tin_number VARCHAR(20) UNIQUE NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES user_identifier(user_id)
) ENGINE=InnoDB;

-- 3️⃣ Business Application Tables
CREATE TABLE IF NOT EXISTS applications (
  application_id INT AUTO_INCREMENT PRIMARY KEY,
  business_id INT NOT NULL,
  status_id Int DEFAULT 1,
  application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_by INT DEFAULT NULL,
  reviewed_at TIMESTAMP NULL,
  comments TEXT NULL,
  FOREIGN KEY (business_id) REFERENCES businesses(business_id),
  FOREIGN KEY (reviewed_by) REFERENCES user_identifier(user_id),
  FOREIGN KEY (status_id) REFERENCES application_status(status_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS application_documents (
  document_id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_img VARCHAR(255) NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(application_id)
) ENGINE=InnoDB;

-- 5️⃣ Approval Process Tables
CREATE TABLE IF NOT EXISTS approvals (
  approval_id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  approved_by INT NULL,
  decision_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(application_id),
  FOREIGN KEY (approved_by) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- 6️⃣ License Issuance Tables
CREATE TABLE IF NOT EXISTS licenses (
  license_id INT AUTO_INCREMENT PRIMARY KEY,
  business_id INT NOT NULL,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  issued_date DATE NOT NULL,
  license_status INT DEFAULT 1,
  expiry_date DATE NOT NULL,
  FOREIGN KEY (business_id) REFERENCES businesses(business_id)
  FOREIGN KEY (license_status) REFERENCES license_status(status_id)
) ENGINE=InnoDB;

-- 7️⃣ Tracking & Logs Tables
CREATE TABLE IF NOT EXISTS logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- 8️⃣ Role Table
CREATE TABLE IF NOT EXISTS Roles (
  Role_id INT AUTO_INCREMENT PRIMARY KEY,
  Role_Name VARCHAR(30) NOT NULL
) ENGINE=InnoDB;
--status table for application
CREATE TABLE IF NOT EXISTS application_status (
  status_id INT AUTO_INCREMENT PRIMARY KEY,
  status_name VARCHAR(30) NOT NULL
) ENGINE=InnoDB;
--status table for license table
CREATE TABLE IF NOT EXISTS license_status (
  status_id INT AUTO_INCREMENT PRIMARY KEY,
  status_name VARCHAR(30) NOT NULL
) ENGINE=InnoDB;
--insert 3 status values
INSERT INTO license_status (status_name) VALUES ('pending'), ('approved'), ('rejected');

--insert 3 status values 
INSERT INTO application_status (status_name) VALUES ('pending'), ('approved'), ('rejected');
--insert 3 role values
INSERT INTO Roles (Role_Name) VALUES ('owner'), ('employee'), ('admin');
