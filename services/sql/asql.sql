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
  uuid CHAR(36) NOT NULL DEFAULT (UUID()),
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

INSERT INTO users (
  user_email, user_first_name, user_last_name, user_phone_number, role_id, user_pass, user_img
) VALUES
  ('johnn@gmail.com', 'John', 'Doe', '1234567890', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8T_qrrKzaiZokZ5Y8l_hz-h_6Pzj-DJys_w&s'),
  ('janee@gmail.com', 'Jane', 'Smith', '2345678901', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLqCg_3dCP0CG8v9ztaqOKtbSbJbEr6o_iOQ&s'),
  ('alicee@gmail.com', 'Alice', 'Johnson', '3456789012', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZZ8xKo-l7EQNR0os9O3OKd5X4q8SNhssdJQ&s'),
  ('bobb@gmail.com', 'Bob', 'Brown', '4567890123', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNNRqKoghIDo3Vefq59_pyxm3TMTFnMYzOzg&s'),
  ('charliee@gmail.com', 'Charlie', 'Davis', '5678901234', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8831pQ8Y-mFTGjw0zrJ3sCH_1KjLl6pF3DQ&s'),
  ('dianaa@gmail.com', 'Diana', 'Evans', '6789012345', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIRJ5nwuV-FX7K8xtX9kIYnmdasrXn6CBPoQ&s'),
  ('edwardd@gmail.com', 'Edward', 'Frank', '7890123456', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJJkcgOCs3dwl7VeptyT6WcCXA6b_sd4bg_Q&s'),
  ('fionaa@gmail.com', 'Fiona', 'Green', '8901234567', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOibf_zMJrX5wOi_b7YoUcT_i4tV0fsWfhFw&s'),
  ('georgea@gmail.com', 'George', 'Harris', '9012345678', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD85pBxRQ0vjJ5ajID5hCnlEMobWI-NSMizw&s'),
  ('hannaha@gmail.com', 'Hannah', 'Irwin', '0123456789', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe7EAoMGaAGwlrkB8MPGCx9FlM3dkhDx9ogg&s'),
  ('iana@gmail.com', 'Ian', 'Jackson', '1234509876', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSjCSCXNlUhqvZb3uftPqf1it_e8zRZDoFAw&s'),
  ('jessicaa@gmail.com', 'Jessica', 'Klein', '2345610987', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjBuBxieYD3is7BkWlBOfSKwzu4ihbEhUdSA&s'),
  ('kevina@gmail.com', 'Kevin', 'Lee', '3456721098', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSjCSCXNlUhqvZb3uftPqf1it_e8zRZDoFAw&s'),
  ('lauraa@gmail.com', 'Laura', 'Miller', '4567832109', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjBuBxieYD3is7BkWlBOfSKwzu4ihbEhUdSA&s'),
  ('michaela@gmail.com', 'Michael', 'Nelson', '5678943210', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6W9BALM7btBgMEl_yvuhcnDNiiFC1dNIrWw&s'),
  ('johnns@gmail.com', 'John', 'Doe', '1234567890', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSjCSCXNlUhqvZb3uftPqf1it_e8zRZDoFAw&s'),
  ('jsanee@gmail.com', 'Jane', 'Smith', '2345678901', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGLXtwBBIP7-UAmoBFiPAwnERNB9vMyrwXLA&s'),
  ('alsicee@gmail.com', 'Alice', 'Johnson', '3456789012', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSK8i4bR54Qc3xq7Z8zHd37MrfXoA0zkoNUg&s'),
  ('bobsb@gmail.com', 'Bob', 'Brown', '4567890123', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxc9_yufDCMwbluzYkFlzen8Ci_vaS9-aiWQ&s'),
  ('charsliee@gmail.com', 'Charlie', 'Davis', '5678901234', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCAJxecQqwPZkkgeuN4fmjFRRVpehulJCCzw&s'),
  ('dianasa@gmail.com', 'Diana', 'Evans', '6789012345', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4ksAOG1-tG_yKIOWWD8Jpa28LFZm3yRq43g&s'),
  ('edwardsd@gmail.com', 'Edward', 'Frank', '7890123456', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT19n3qHK4WbySB45to_jKamN-18T93gmzpHQ&s'),
  ('fionaas@gmail.com', 'Fiona', 'Green', '8901234567', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTykr0VOrHc1lwdT5f60gtVaYysegdovE5SKg&s'),
  ('georgesa@gmail.com', 'George', 'Harris', '9012345678', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR6chgWjQI1k04UVoCvBc1sO1ft3rTCff9Tw&s'),
  ('hannahsa@gmail.com', 'Hannah', 'Irwin', '0123456789', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWDIydYkAwU2zol8o73C1r7RNwJYdjCrWLFw&s'),
  ('ianas@gmail.com', 'Ian', 'Jackson', '1234509876', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCwPnzHSLxGd1hkFuNEf7CaiBGGuMkApY_XA&s'),
  ('jsessicaa@gmail.com', 'Jessica', 'Klein', '2345610987', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH-flqtGi3hZCmUNXa4ZX_n3INw2WBLpQcpg&s'),
  ('kesvina@gmail.com', 'Kevin', 'Lee', '3456721098', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrKGuVOlBAp0O8A6RiWxMRsAOq_9MyRZ2QFQ&s'),
  ('lausraa@gmail.com', 'Laura', 'Miller', '4567832109', 2, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsg1DL5h3xZ6mqoITXFP6T0zsK1j1Y9gq2tA&s'),
  ('johnnn@gmail.com', 'John', 'Doe', '1234567890', 2, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8T_qrrKzaiZokZ5Y8l_hz-h_6Pzj-DJys_w&s'),
  ('janeee@gmail.com', 'Jane', 'Smith', '2345678901', 2, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLqCg_3dCP0CG8v9ztaqOKtbSbJbEr6o_iOQ&s'),
  ('aliceee@gmail.com', 'Alice', 'Johnson', '3456789012', 2, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZZ8xKo-l7EQNR0os9O3OKd5X4q8SNhssdJQ&s'),
  ('bobnb@gmail.com', 'Bob', 'Brown', '4567890123', 2, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNNRqKoghIDo3Vefq59_pyxm3TMTFnMYzOzg&s'),
  ('chareliee@gmail.com', 'Charlie', 'Davis', '5678901234', 2, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8831pQ8Y-mFTGjw0zrJ3sCH_1KjLl6pF3DQ&s'),
  ('dianaan@gmail.com', 'Diana', 'Evans', '6789012345', 2, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIRJ5nwuV-FX7K8xtX9kIYnmdasrXn6CBPoQ&s'),
  ('edwaredd@gmail.com', 'Edward', 'Frank', '7890123456', 2, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJJkcgOCs3dwl7VeptyT6WcCXA6b_sd4bg_Q&s'),
  ('michsaela@gmail.com', 'Michael', 'Nelson', '5678943210', 1, '12345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6W9BALM7btBgMEl_yvuhcnDNiiFC1dNIrWw&s');
