-- Create Database
CREATE DATABASE ProductCatalogDB;
GO
USE ProductCatalogDB;
GO

-- Create table Categories
CREATE TABLE Categories (
    IdCategory INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255) NULL,
    Active BIT DEFAULT 1 NOT NULL,
    CreationDate DATETIME DEFAULT GETDATE(),
    ModificationDate DATETIME NULL
);

-- Constrain Name Unique
ALTER TABLE Categories
ADD CONSTRAINT UQ_Categories_Name UNIQUE (Name);

-- Create table Products
CREATE TABLE Products (
    IdProduct INT IDENTITY(1,1) PRIMARY KEY,
    IdCategory INT NOT NULL,
    Name NVARCHAR(150) NOT NULL,
    Description NVARCHAR(500) NULL,
    Sku NVARCHAR(50) NULL,
    Price DECIMAL(18, 2) NOT NULL,
    Stock INT DEFAULT 0 NOT NULL,
    Active BIT DEFAULT 1 NOT NULL,
    CreationDate DATETIME DEFAULT GETDATE(),
    ModificationDate DATETIME NULL,
    
    -- Relation (Foreign Key)
    CONSTRAINT FK_Products_Categories FOREIGN KEY (IdCategory)
    REFERENCES Categories (IdCategory)
);

-- Constraint validate Price > 0
ALTER TABLE Products
ADD CONSTRAINT CK_Products_Price CHECK (Price > 0);

-- Indexes for Optimization
CREATE NONCLUSTERED INDEX IX_Products_IdCategory ON Products(IdCategory);
CREATE NONCLUSTERED INDEX IX_Products_Name ON Products(Name);
CREATE NONCLUSTERED INDEX IX_Products_Price ON Products(Price);

-- Seed Data (Initial test data)

-- Insert into Categories
INSERT INTO Categories (Name, Description) 
VALUES 
('Electrónica', 'Gadgets y dispositivos'),
('Hogar', 'Artículos para la casa');

-- Insert into Products
INSERT INTO Products (IdCategory, Name, Price, Stock, Sku) VALUES 
(1, 'Laptop Gamer', 1200.00, 10, 'LPT-001'),
(1, 'Mouse Inalámbrico', 25.50, 50, 'MSE-002'),
(2, 'Lámpara LED', 15.00, 100, 'LMP-001');

GO

