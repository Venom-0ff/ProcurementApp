-- add some vendors
INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email)
 VALUES ('123 Maple St','London','On', 'N1N-1N1','(555)555-5555','Trusted','ABC Supply Co.','abc@supply.com');
INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email)
 VALUES ('543 Sycamore Ave','Toronto','On', 'N1P-1N1','(999)555-5555','Trusted','Big Bills Depot','bb@depot.com');
INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email)
 VALUES ('922 Oak St','London','On', 'N1N-1N1','(555)555-5599','Untrusted','Shady Sams','ss@underthetable.com');
INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email)
 VALUES ('420 Green St','London','On', 'N1N-1N1','(519)555-5555','Untrusted','SK Depot','sales@skdepot.com');

-- add some products
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('87K-B0F74', 2, 'Product A', 734.09, 1651.93, 73.4, 818.88, 293.83, 505.7);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('56W-L3Z99', 1, 'Product B', 532.51, 1693.57, 33.03, 744.94, 694.21, 633.35);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('23O-R5P40', 3, 'Product C', 660.12, 890.34, 16.38, 22.43, 395.4, 433.2);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('99K-H7Z75', 3, 'Product D', 225.62, 1675.12, 59.81, 276.41, 255.2, 568.6);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('38W-R4K72', 2, 'Product E', 641.29, 714.11, 56.03, 874.2, 77.13, 847.31);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('78F-F2O73', 2, 'Product F', 1843.89, 1933.04, 71.61, 193.98, 579.78, 120.84);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('47G-U5W56', 1, 'Product G', 1292.2, 1405.54, 83.37, 579.4, 801.83, 754.78);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('01Z-E8U23', 1, 'Product H', 1009.21, 1311.36, 38.58, 508.79, 509.18, 81.68);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('61F-M0N88', 2, 'Product I', 1091.55, 1501.31, 17.88, 757.32, 479.53, 600.74);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('46A-C7G61', 2, 'Product J', 246.63, 1756.44, 53.21, 929.78, 935.04, 677.26);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('16E-W9E48', 1, 'Product K', 1047.16, 1398.17, 42.62, 607.28, 286.4, 321.98);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('45P-X2N18', 3, 'Product L', 1112.37, 1534.95, 21.77, 28.75, 255.07, 994.37);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('73E-H4E61', 2, 'Product M', 1229.88, 1707.27, 82.14, 734.34, 519.18, 480.67);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('79P-O3V43', 4, 'Product N', 293.98, 1062.41, 98.55, 72.51, 824.42, 824.21);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('75S-N1J12', 4, 'Product O', 1243.05, 1487.44, 77.63, 138.25, 29.9, 276.37);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('73S-Q7R63', 3, 'Product P', 132.4, 165.21, 65.69, 784.28, 755.6, 788.06);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('09I-T2X21', 4, 'Product Q', 1511.02, 1629.26, 4.4, 599.28, 878.45, 994.82);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('84P-C7I66', 2, 'Product R', 708.78, 711.01, 43.54, 56.7, 332.58, 134.94);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('00L-W2D25', 2, 'Product S', 470.85, 550.56, 71.99, 279.52, 887.6, 692.63);
INSERT INTO Product (Id, VendorId, Name, CostPrice, MSRP, ROP, EOQ, QOH, QOO)
 VALUES ('24I-A3Z35', 3, 'Product T', 360.07, 1359.64, 70.37, 898.81, 671.9, 429.22);