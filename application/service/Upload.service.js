let WorkShop = require('./../../db/model/WorkShop-model');
let Address = require('./../../db/model/Address-model');
let Supplier = require('./../../db/model/Supplier-model');
let async = require('async')
let log4js = require('log4js');
let logger = log4js.getLogger('UPLOADSERVICE');
logger.level = 'debug';
const suppliers = [
    {
        'Account Code': 'APS001',
        'Supplier Name': 'AP Single Cheque Account - Branch 1',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Supplier Address': '',
        'Outstanding Balance': '0'
    },
    {
        'Account Code': 'BNK001',
        'Supplier Name': 'Bank Charges - Trading Co. 1',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Supplier Address': '',
        'Outstanding Balance': '0'
    },
    {
        'Account Code': 'IBP001',
        'Supplier Name': 'Inter-Branch Account - Branch 1',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Supplier Address': '',
        'Outstanding Balance': '0'
    },
    {
        'Account Code': 'PCA001',
        'Supplier Name': 'Petty Cash Account - Branch 1',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Supplier Address': '',
        'Outstanding Balance': '0'
    },
    {
        'Account Code': 'REQ001',
        'Supplier Name': 'Requisition account - Branch 1',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Supplier Address': '',
        'Outstanding Balance': '0'
    },
    {
        'Account Code': 'S00000',
        'Supplier Name': 'AP CLEARING TEMP ERRORS',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Supplier Address': '',
        'Outstanding Balance': '88783.19'
    },
    {
        'Account Code': 'S00001',
        'Supplier Name': 'AUTOBOYS AUTOMOTIVE',
        'Telephone Number': '0123791610',
        'EMAIL Address': 'hennied@autoboys.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '79915.809999999983'
    },
    {
        'Account Code': 'S00002',
        'Supplier Name': 'MAKRO',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Supplier Address': '',
        'Outstanding Balance': '-1140'
    },
    {
        'Account Code': 'S00003',
        'Supplier Name': 'EUPHORIA',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Supplier Address': '',
        'Outstanding Balance': '0'
    },
    {
        'Account Code': 'S00004',
        'Supplier Name': 'CMH VOLVO SILVER LAKES',
        'Telephone Number': '012 809 5000',
        'EMAIL Address': 'wedgar@cmh.co.za',
        'Supplier Address': 'PRETORIA',
        'Outstanding Balance': '689.76999999999862'
    },
    {
        'Account Code': 'S00007',
        'Supplier Name': 'N1 4x4',
        'Telephone Number': '012 545 0200',
        'EMAIL Address': 'finance1@n14x4.co.za',
        'Supplier Address': 'PYRAMID',
        'Outstanding Balance': '19597.43'
    },
    {
        'Account Code': 'S00010',
        'Supplier Name': 'ULTIMATE SUSPENSION',
        'Telephone Number': '012 335 0696',
        'EMAIL Address': 'info@ultimatesuspension.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '71161.410000000033'
    },
    {
        'Account Code': 'S00013',
        'Supplier Name': 'NASKAR SPARES AND ACCESSORIES',
        'Telephone Number': '012 804 1000',
        'EMAIL Address': 'dominique@naskar.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '539928.01999999839'
    },
    {
        'Account Code': 'S00016',
        'Supplier Name': 'VW HATFIELD BRAAMFONTEIN',
        'Telephone Number': '011 408 0032 /59 /81',
        'EMAIL Address': 'faizel@hatfieldvw.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '92025.840000000084'
    },
    {
        'Account Code': 'S00019',
        'Supplier Name': 'DAR AUTOMOTIVE',
        'Telephone Number': '082 0505 833',
        'EMAIL Address': 'andrew@dargroup.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '0'
    },
    {
        'Account Code': 'S00022',
        'Supplier Name': 'FIRST NATIONAL BATTERY',
        'Telephone Number': '011 741 3600',
        'EMAIL Address': 'charleneb@battery.co.za',
        'Supplier Address': '1502',
        'Outstanding Balance': '585821.48000000126'
    },
    {
        'Account Code': 'S00025',
        'Supplier Name': 'CENT PARTS',
        'Telephone Number': '012 653 6567 / 7503 / 8063',
        'EMAIL Address': 'luan@centparts.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '119690.22999999994'
    },
    {
        'Account Code': 'S00028',
        'Supplier Name': 'GOLDWAGEN PRETORIA NORTH',
        'Telephone Number': '012 546 0225',
        'EMAIL Address': 'mina.dealmeida@gmail.com',
        'Supplier Address': '',
        'Outstanding Balance': '565677.94999999995'
    },
    {
        'Account Code': 'S00031',
        'Supplier Name': 'MANDARIN PARTS',
        'Telephone Number': '012 749 6800',
        'EMAIL Address': 'mariuss@mpdsa.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '34819.46'
    },
    {
        'Account Code': 'S00034',
        'Supplier Name': 'BMW JO\'BURG CITY AUTO',
        'Telephone Number': '011 220 4900',
        'EMAIL Address': 'sashan.ramlagaan@bmwdealer.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '-3.637978807091713E-12'
    },
    {
        'Account Code': 'S00037',
        'Supplier Name': 'FORD SELBY',
        'Telephone Number': '011 240 5080',
        'EMAIL Address': 'johan.pretorius@bwmr.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '51345.310000000005'
    },
    {
        'Account Code': 'S00040',
        'Supplier Name': 'BARONS VW BRUMA',
        'Telephone Number': '011 856 2600',
        'EMAIL Address': 'nishal.ramnarain@baronsvw.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '72248.999999999985'
    },
    {
        'Account Code': 'S00043',
        'Supplier Name': 'TOYOTA CENTURION',
        'Telephone Number': '012 641 7070',
        'EMAIL Address': 'deon.pretorius@bwmr.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '135259.43'
    },
    {
        'Account Code': 'S00046',
        'Supplier Name': 'CLUB MOTORS FOUNTAINS BMW',
        'Telephone Number': '012 444 16600',
        'EMAIL Address': 'joseph.tsoku@clubfountains.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '40506.849999999991'
    },
    {
        'Account Code': 'S00049',
        'Supplier Name': 'GM ZAMBEZI',
        'Telephone Number': '012 623 2350',
        'EMAIL Address': 'george.nkosi@bwmr.co.za',
        'Supplier Address': 'PRETORIA',
        'Outstanding Balance': '94322.340000000026'
    },
    {
        'Account Code': 'S00052',
        'Supplier Name': 'IMPERIAL NISSAN MENLYN',
        'Telephone Number': '0124704090',
        'EMAIL Address': 'sbacon@imperialnissan.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '168186.79999999973'
    },
    {
        'Account Code': 'S00055',
        'Supplier Name': 'AUTOZONE WONDERBOOM',
        'Telephone Number': '0125671073',
        'EMAIL Address': 'autozonewonderboom@yahoo.com',
        'Supplier Address': 'CNR LAVENDER ROAD AND',
        'Outstanding Balance': 'BRAAMPRETORIOUS STREET'
    },
    {
        'Account Code': 'S00058',
        'Supplier Name': 'PROBE COPORATION SA',
        'Telephone Number': '0114532141',
        'EMAIL Address': 'frank@probegroup.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '554025.39999999921'
    },
    {
        'Account Code': 'S00061',
        'Supplier Name': 'MERCEDESBENZ LIFE STYLE',
        'Telephone Number': '´0126413100',
        'EMAIL Address': '',
        'Supplier Address': '',
        'Outstanding Balance': '781768.96999999648'
    },
    {
        'Account Code': 'S00064',
        'Supplier Name': 'KIA MOTORS CENTURION',
        'Telephone Number': '012 678 5220',
        'EMAIL Address': 'kobus@kiacenturion.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '30844.730000000021'
    },
    {
        'Account Code': 'S00067',
        'Supplier Name': 'LAZARUS FORD',
        'Telephone Number': '012 678 0000',
        'EMAIL Address': 'neels@laz.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '78192.459999999992'
    },
    {
        'Account Code': 'S00070',
        'Supplier Name': 'LANDROVER CENTURION',
        'Telephone Number': '012 678 0044',
        'EMAIL Address': 'roy@landrovercenturion.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '15574.489999999991'
    },
    {
        'Account Code': 'S00073',
        'Supplier Name': 'JAGUAR CENTURION',
        'Telephone Number': '012 678 0044',
        'EMAIL Address': 'roy@landrovercenturion.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '0'
    },
    {
        'Account Code': 'S00076',
        'Supplier Name': 'LAZARUS MAZDA',
        'Telephone Number': '012 678 0000',
        'EMAIL Address': 'neels@laz.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '18116.919999999998'
    },
    {
        'Account Code': 'S00079',
        'Supplier Name': 'CHRYSLER JEEP',
        'Telephone Number': ' DODGE',
        'EMAIL Address': ' ALFA & FIAT',
        'Supplier Address': 'CENTURION',
        'Outstanding Balance': ''
    },
    {
        'Account Code': 'S00082',
        'Supplier Name': 'AUTOBOYS SELBY',
        'Telephone Number': '011 499 8289',
        'EMAIL Address': 'pierred@autoboys.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '347563.8000000001'
    },
    {
        'Account Code': 'S00085',
        'Supplier Name': 'HONDA EAST RAND',
        'Telephone Number': '011 826 4444',
        'EMAIL Address': 'arichter@imperialhonda.co.za',
        'Supplier Address': '1462',
        'Outstanding Balance': '14319.519999999997'
    },
    {
        'Account Code': 'S00088',
        'Supplier Name': 'IMPERIAL GM ISANDO',
        'Telephone Number': '011 974 3001/2/3/4',
        'EMAIL Address': 'alosinsky@imperialgm.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '0'
    },
    {
        'Account Code': 'S00091',
        'Supplier Name': 'CMH VOLVO PRETORIA',
        'Telephone Number': '012 431 2500',
        'EMAIL Address': 'pm951@cmh.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '10295.149999999998'
    },
    {
        'Account Code': 'S00094',
        'Supplier Name': 'CMH MITSUBISHI HATFIELD',
        'Telephone Number': '012 431 2500',
        'EMAIL Address': 'pm351@cmh.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '17873.769999999997'
    },
    {
        'Account Code': 'S00097',
        'Supplier Name': 'MCCARTHY TOYOTA GROUP',
        'Telephone Number': '011 384 6900',
        'EMAIL Address': 'colynn@mcmotor.co.za',
        'Supplier Address': 'BRYANSTON',
        'Outstanding Balance': '38550.510000000024'
    },
    {
        'Account Code': 'S00100',
        'Supplier Name': 'SUZUKI MONTANA',
        'Telephone Number': '087 353 2550',
        'EMAIL Address': 'kurtlinn@pentamotorgroup.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '469.75'
    },
    {
        'Account Code': 'S00103',
        'Supplier Name': 'JEEP',
        'Telephone Number': ' FIAT MONTANA',
        'EMAIL Address': '010 599 5200',
        'Supplier Address': 'PRETORIA',
        'Outstanding Balance': ''
    },
    {
        'Account Code': 'S00106',
        'Supplier Name': 'SUZUKI MENLYN',
        'Telephone Number': '010 446 4032',
        'EMAIL Address': 'peterm@pentamotorgroup.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '64548.590000000011'
    },
    {
        'Account Code': 'S00109',
        'Supplier Name': 'KOTWALS MOTOR SPARES',
        'Telephone Number': '011 975 4478',
        'EMAIL Address': 'yusuf@vision4all.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '79737.090000000011'
    },
    {
        'Account Code': 'S00115',
        'Supplier Name': 'BARLOWORLD GM CITY DEEP',
        'Telephone Number': '011 296 5000',
        'EMAIL Address': 'tyrone.volkwyn@bwmr.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '64162.909999999996'
    },
    {
        'Account Code': 'S00118',
        'Supplier Name': 'GERMO PARTS',
        'Telephone Number': '012 252 0426',
        'EMAIL Address': 'hein@germoparts.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '268547.40000000026'
    },
    {
        'Account Code': 'S00124',
        'Supplier Name': 'FUCHS LUBRICANTS',
        'Telephone Number': '012 565 9600',
        'EMAIL Address': 'roys@fuchsoil.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '27456.25'
    },
    {
        'Account Code': 'S00136',
        'Supplier Name': 'HI-Q (AIRPORT TYRE & FITMENT CENTRE)',
        'Telephone Number': '011 394-1010 / 11 / 12',
        'EMAIL Address': 'sales@airporttyres.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '0'
    },
    {
        'Account Code': 'S00139',
        'Supplier Name': 'BARLOWORLD MAZDA SELBY (BRUMA)',
        'Telephone Number': '011 240 5037/38/39',
        'EMAIL Address': 'johan.pretorius@bwmr.co.za',
        'Supplier Address': '2001',
        'Outstanding Balance': '128.03'
    },
    {
        'Account Code': 'S00142',
        'Supplier Name': 'ZAMBESI AUTO',
        'Telephone Number': '012 523 3600',
        'EMAIL Address': 'dries.neethling@zambesiauto.co.za',
        'Supplier Address': '',
        'Outstanding Balance': '3257.3799999999997'
    },
    {
        'Account Code': 'S00145',
        'Supplier Name': 'BARLOWORLD TOYOTA MENLYN',
        'Telephone Number': '012 995 1700',
        'EMAIL Address': 'vanashree.padayachee@bwmr.co.za',
        'Supplier Address': 'PRETORIA',
        'Outstanding Balance': '4565.97'
    },
    {
        'Account Code': 'S00148',
        'Supplier Name': 'TURBOWORKS',
        'Telephone Number': '012 653 7507',
        'EMAIL Address': 'sales@turboworks.co.za',
        'Supplier Address': ' CENTURION',
        'Outstanding Balance': 'PRETORIA'
    },
    {
        'Account Code': 'S00154',
        'Supplier Name': 'BB ZAMBESI HONDA',
        'Telephone Number': '012 523 9500',
        'EMAIL Address': 'partsmanager@bbzambezihonda.co.za',
        'Supplier Address': 'PRETORIA',
        'Outstanding Balance': '19640.849999999999'
    },
    {
        'Account Code': 'S00157',
        'Supplier Name': 'BB Gezina Nissan',
        'Telephone Number': '012 404 0000',
        'EMAIL Address': 'partsmanager@bbgezinanissan.co.za',
        'Supplier Address': 'PRETORIA',
        'Outstanding Balance': '37482.54'
    },
    {
        'Account Code': 'S00160',
        'Supplier Name': 'BB HATFIELD RENAULT',
        'Telephone Number': '012 335 7352',
        'EMAIL Address': 'partsmanager@bbhatfield.co.za',
        'Supplier Address': 'PRETORIA',
        'Outstanding Balance': '12034.980000000003'
    },
    {
        'Account Code': 'S00178',
        'Supplier Name': 'MENLYN MULTIFRANCHISE',
        'Telephone Number': '012 470 5999',
        'EMAIL Address': 'elmonm@multifranchise.co.za',
        'Supplier Address': 'PRETORIA',
        'Outstanding Balance': '5096.309999999994'
    },
    {
        'Account Code': 'S00184',
        'Supplier Name': 'SANDOWN COMMERCIAL VEHICLES CENTURION',
        'Telephone Number': '012 621 0000',
        'EMAIL Address': 'leightonw@sandown.co.za',
        'Supplier Address': 'CENTURION',
        'Outstanding Balance': '81877.999999999985'
    },
    {
        'Account Code': 'S00196',
        'Supplier Name': 'GOLDWAGEN EAST RAND',
        'Telephone Number': '011 823 5227 / 8',
        'EMAIL Address': 'eastrand@goldwagen.com',
        'Supplier Address': 'BOKSBURG',
        'Outstanding Balance': '33882.000000000007'
    },
    {
        'Account Code': 'S00199',
        'Supplier Name': 'MERCEDES BENZ GAUTENG WEST',
        'Telephone Number': '011 280 1000 / 011 478 2518',
        'EMAIL Address': 'abramk@sandown.co.za',
        'Supplier Address': 'JOHANNESBURG',
        'Outstanding Balance': '241602.08000000022'
    },
    {
        'Account Code': 'S00208',
        'Supplier Name': 'AUTO ALPINA BOKSBURG',
        'Telephone Number': '011 418 3300',
        'EMAIL Address': 'ross.turner2@bmwdealer.co.za',
        'Supplier Address': 'GAUTENG',
        'Outstanding Balance': '4631.7599999999993'
    },
    {
        'Account Code': 'S00211',
        'Supplier Name': 'BB MENLYN FORD',
        'Telephone Number': '012 368 8000',
        'EMAIL Address': 'partsmanager@bbmenlyn.co.za',
        'Supplier Address': 'PRETORIA',
        'Outstanding Balance': '30194.850000000002'
    },
    {
        'Account Code': 'S00217',
        'Supplier Name': 'HATFIELD VW BRAAMFONTEIN',
        'Telephone Number': '011 408 0000',
        'EMAIL Address': 'faizel@hatfieldvw.co.za',
        'Supplier Address': 'GAUTENG',
        'Outstanding Balance': '935.53'
    },
    {
        'Account Code': 'S00220',
        'Supplier Name': 'TURBOFIX',
        'Telephone Number': '011 814 2299',
        'EMAIL Address': 'renaldo@turbofix.co.za',
        'Supplier Address': 'GAUTENG',
        'Outstanding Balance': '9701.4'
    },
    {
        'Account Code': 'S10001',
        'Supplier Name': 'Kerridge Commercial Systems',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Supplier Address': '2021',
        'Outstanding Balance': '0'
    },
    {
        'Account Code': 'WKP001',
        'Supplier Name': 'Work Order Account - Branch 1',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Supplier Address': '',
        'Outstanding Balance': '0'
    },
    {
        'Account Code': ''
    }
];
const workshops = [
    {
        'Account Number': 'CAS001',
        'Customer Name': 'Cash Account - Branch 1',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Customer Postcode': '9999',
        'Address': '',
        'Credit Limit': '9999999',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'IBR001',
        'Customer Name': 'Inter-Branch Sales - Branch 1',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Customer Postcode': '9999',
        'Address': '',
        'Credit Limit': '9999999',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'L00001',
        'Customer Name': 'M-CENTRE - LOYALTY ACC',
        'Telephone Number': '012 653 7855',
        'EMAIL Address': 'lesm@m-centre.co.za',
        'Customer Postcode': '0157',
        'Address': '',
        'Credit Limit': '250000',
        'Outstanding Bal': '-22655.59'
    },
    {
        'Account Number': 'L00004',
        'Customer Name': 'HENRY MOTORS - LOYALTY ACC',
        'Telephone Number': '012 348 4204',
        'EMAIL Address': 'admin@henrymotors.co.za',
        'Customer Postcode': '',
        'Address': '',
        'Credit Limit': '200000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'L00007',
        'Customer Name': 'ROYAL MAINTENTANCE - LOYALTY ACC',
        'Telephone Number': '012 803 7727',
        'EMAIL Address': 'admin@royalmaintenance.co.za',
        'Customer Postcode': '',
        'Address': '',
        'Credit Limit': '200000',
        'Outstanding Bal': '-934.24'
    },
    {
        'Account Number': 'L00010',
        'Customer Name': 'KGABOTSE FIELD REPAIRS - LOYALTY ACC',
        'Telephone Number': '012 546 7546',
        'EMAIL Address': 'kgabotse@lantic.net',
        'Customer Postcode': '0182',
        'Address': '',
        'Credit Limit': '200000',
        'Outstanding Bal': '-10618.37'
    },
    {
        'Account Number': 'L00013',
        'Customer Name': 'KL SERVICES - LOYALTY ACC',
        'Telephone Number': '012 661 5692',
        'EMAIL Address': 'klservices.za@gmail.com',
        'Customer Postcode': '0046',
        'Address': '',
        'Credit Limit': '220000',
        'Outstanding Bal': '-3232.36'
    },
    {
        'Account Number': 'L00016',
        'Customer Name': 'JJ VELDDIENSTE - LOYALTY ACC',
        'Telephone Number': '012 804 4987',
        'EMAIL Address': 'jjvelddienste@gmail.com',
        'Customer Postcode': '0184',
        'Address': '',
        'Credit Limit': '150000',
        'Outstanding Bal': '-10306.709999999999'
    },
    {
        'Account Number': 'L00019',
        'Customer Name': 'HATTINGH MOTORS - LOYALTY ACC',
        'Telephone Number': '012 663 6477',
        'EMAIL Address': 'vera@hattinghmotors.co.za',
        'Customer Postcode': '0157',
        'Address': '',
        'Credit Limit': '500000',
        'Outstanding Bal': '-5447.12'
    },
    {
        'Account Number': 'L00022',
        'Customer Name': 'KOKKIES PERFORMANCE CENTRE - LOYALTY ACC',
        'Telephone Number': '012 804 9416',
        'EMAIL Address': 'kokkiesautocentre@gmail.com',
        'Customer Postcode': '0184',
        'Address': '',
        'Credit Limit': '120000',
        'Outstanding Bal': '-10588.2'
    },
    {
        'Account Number': 'L00025',
        'Customer Name': 'GEARBOX & DIFF REBUILDING - LOYALTY ACC',
        'Telephone Number': '012 327 1275',
        'EMAIL Address': 'abooyse@gearbox-diff.co.za',
        'Customer Postcode': '0183',
        'Address': '',
        'Credit Limit': '200000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'L00028',
        'Customer Name': 'MENLYN MOTOR SERVICES - LOYALTY ACC',
        'Telephone Number': '012 348 3090',
        'EMAIL Address': 'mag@menlynmotorservices.co.za',
        'Customer Postcode': '0181',
        'Address': '',
        'Credit Limit': '150000',
        'Outstanding Bal': '-1836.47'
    },
    {
        'Account Number': 'L00031',
        'Customer Name': 'YOUR MOTOR CLINIC - LOYALTY ACC',
        'Telephone Number': '012 846 7021',
        'EMAIL Address': 'sharonjoubert@ymail.com',
        'Customer Postcode': '0184',
        'Address': '',
        'Credit Limit': '120000',
        'Outstanding Bal': '-12919.93'
    },
    {
        'Account Number': 'L00034',
        'Customer Name': 'CAR VAN TRUCK - LOYALTY ACC',
        'Telephone Number': '012 662 1296',
        'EMAIL Address': 'suecoetzee@yebo.co.za',
        'Customer Postcode': '0157',
        'Address': '',
        'Credit Limit': '100000',
        'Outstanding Bal': '-1349.12'
    },
    {
        'Account Number': 'L00037',
        'Customer Name': 'JT CAR SERVICE - LOYALTY ACC',
        'Telephone Number': '012 997 2422',
        'EMAIL Address': 'jtcarservice@netmobile.co.za',
        'Customer Postcode': '',
        'Address': '',
        'Credit Limit': '70000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'L00040',
        'Customer Name': 'AUTOZONE WONDERBOOM - LOYALTY ACCOUNT',
        'Telephone Number': '012 327 0290',
        'EMAIL Address': 'cylinderheadexchange@yahoo.com',
        'Customer Postcode': '0183',
        'Address': '',
        'Credit Limit': '50000',
        'Outstanding Bal': '-2512.0400000000004'
    },
    {
        'Account Number': 'L00043',
        'Customer Name': 'N1 4x4 - LOYALTY ACC',
        'Telephone Number': '012 545 0200',
        'EMAIL Address': 'admin@n14x4.co.za',
        'Customer Postcode': '0120',
        'Address': 'PRETORIA',
        'Credit Limit': '',
        'Outstanding Bal': '220000'
    },
    {
        'Account Number': 'L00046',
        'Customer Name': 'FAERIE GLEN MOTOR CLINIC - LOYALTY ACC',
        'Telephone Number': '012 991 4724',
        'EMAIL Address': 'fgmotorclinic@live.co.za',
        'Customer Postcode': '0043',
        'Address': '',
        'Credit Limit': '150000',
        'Outstanding Bal': '-5937.7800000000007'
    },
    {
        'Account Number': 'L00049',
        'Customer Name': 'LPM TRADING - LOYALTY ACC',
        'Telephone Number': '012 666 8128',
        'EMAIL Address': 'joanita@lpm.co.za',
        'Customer Postcode': '0157',
        'Address': '',
        'Credit Limit': '150000',
        'Outstanding Bal': '-5681.18'
    },
    {
        'Account Number': 'L00052',
        'Customer Name': 'JORGE\'S AUTO CLINIC - LOYALTY ACC',
        'Telephone Number': '012 993 2021',
        'EMAIL Address': 'jkmraraujo@gmail.com',
        'Customer Postcode': '',
        'Address': '',
        'Credit Limit': '100000',
        'Outstanding Bal': '-1090.5899999999999'
    },
    {
        'Account Number': 'L00055',
        'Customer Name': 'MOOTORIA - LOYALTY ACC',
        'Telephone Number': '012 331 1890',
        'EMAIL Address': 'labuschnj@telkomsa.net',
        'Customer Postcode': '',
        'Address': '',
        'Credit Limit': '100000',
        'Outstanding Bal': '-1867.76'
    },
    {
        'Account Number': 'L00058',
        'Customer Name': 'TRANSPORT MOTOR REPAIRS - LOYALTY ACC',
        'Telephone Number': '012 329 1410',
        'EMAIL Address': 'tmr1@vodamail.co.za',
        'Customer Postcode': '',
        'Address': '',
        'Credit Limit': '150000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'L00061',
        'Customer Name': 'KOOPS - LOYALTY ACC',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Customer Postcode': '',
        'Address': '',
        'Credit Limit': '150000',
        'Outstanding Bal': '-11201.189999999995'
    },
    {
        'Account Number': 'L00064',
        'Customer Name': 'ACD GEZINA VOORTREKKER VALUE SERVE - LOYALTY',
        'Telephone Number': '0728247061',
        'EMAIL Address': 'voortrekkervalueserve@telkomsa.net',
        'Customer Postcode': '0037',
        'Address': '',
        'Credit Limit': '120000',
        'Outstanding Bal': '-469.09000000000003'
    },
    {
        'Account Number': 'L00067',
        'Customer Name': 'STOMAN MOTORS - LOYALTY ACOCUNT',
        'Telephone Number': '083 297 3753',
        'EMAIL Address': 'Stomanmotors@hotmail.com',
        'Customer Postcode': '0157',
        'Address': '',
        'Credit Limit': '50000',
        'Outstanding Bal': '-8578.3900000000012'
    },
    {
        'Account Number': 'L00070',
        'Customer Name': 'LA MONTAGNE MOTORS - LOYALTY ACCOUNT',
        'Telephone Number': '0725264229',
        'EMAIL Address': 'lamontagnemotors@gmail.com',
        'Customer Postcode': '0184',
        'Address': '',
        'Credit Limit': '50000',
        'Outstanding Bal': '-3525.36'
    },
    {
        'Account Number': 'L00074',
        'Customer Name': 'VEHICLE WHISPERER - LOYALTY ACC',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Customer Postcode': '',
        'Address': '',
        'Credit Limit': '0',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'L00076',
        'Customer Name': 'FASTSERV AUTO - LOYALTY ACCOUNT',
        'Telephone Number': '0123336094',
        'EMAIL Address': 'gezina@fastservauto.co.za',
        'Customer Postcode': '0186',
        'Address': '',
        'Credit Limit': '150000',
        'Outstanding Bal': '-11.92'
    },
    {
        'Account Number': 'L00079',
        'Customer Name': 'ADVANCED AUTO / NO PROBLEM AUTO',
        'Telephone Number': '012 653 0247',
        'EMAIL Address': 'bookings@advancedautomotive.co.za',
        'Customer Postcode': '0157',
        'Address': '',
        'Credit Limit': '100000',
        'Outstanding Bal': '-1085.76'
    },
    {
        'Account Number': 'L00082',
        'Customer Name': 'ACD FRIK NEL MOTORS - LOYALTY ACCOUNT',
        'Telephone Number': '0826546424',
        'EMAIL Address': 'acdwierda@gmail.com',
        'Customer Postcode': '0134',
        'Address': '',
        'Credit Limit': '70000',
        'Outstanding Bal': '-2176.4'
    },
    {
        'Account Number': 'L00085',
        'Customer Name': 'AUTO DOCTORS - LOYALTY ACCOUNT',
        'Telephone Number': '0834991110',
        'EMAIL Address': 'rachel@autodoctor.co.za',
        'Customer Postcode': '0082',
        'Address': '',
        'Credit Limit': '120000',
        'Outstanding Bal': '-3023.48'
    },
    {
        'Account Number': 'L00088',
        'Customer Name': 'PETER\'S AUTO CARE - LOYALTY ACCOUNT',
        'Telephone Number': '0825534699',
        'EMAIL Address': 'petersauto@telkomsa.net',
        'Customer Postcode': '1401',
        'Address': '',
        'Credit Limit': '150000',
        'Outstanding Bal': '-1292.82'
    },
    {
        'Account Number': 'L00091',
        'Customer Name': 'AUTOBOYS WONDERBOOM - LOYALTY ACCOUNT',
        'Telephone Number': '012 942 9385',
        'EMAIL Address': 'hennied@autoboys.co.za',
        'Customer Postcode': '2092',
        'Address': 'PRETORIA',
        'Credit Limit': '5000',
        'Outstanding Bal': '-15.64'
    },
    {
        'Account Number': 'L00094',
        'Customer Name': 'VENTER GEARBOX - LOYALTY ACCOUNT',
        'Telephone Number': '0836558171',
        'EMAIL Address': 'ventergd@telkomsa.net',
        'Customer Postcode': '0120',
        'Address': '',
        'Credit Limit': '150000',
        'Outstanding Bal': '-2590.8599999999997'
    },
    {
        'Account Number': 'L00097',
        'Customer Name': 'SPEED WORX - LOYALTY ACCOUNT',
        'Telephone Number': '0129914537',
        'EMAIL Address': 'alane@speedworx-pta.co.za',
        'Customer Postcode': '0043',
        'Address': '',
        'Credit Limit': '80000',
        'Outstanding Bal': '-4191.34'
    },
    {
        'Account Number': 'L00100',
        'Customer Name': 'BEAT BOYS - LOYALTY ACCOUNT',
        'Telephone Number': '012 335 4242',
        'EMAIL Address': 'gert.pretorius@yahoo.com',
        'Customer Postcode': '0124',
        'Address': '',
        'Credit Limit': '100000',
        'Outstanding Bal': '-3183.2099999999996'
    },
    {
        'Account Number': 'L00103',
        'Customer Name': 'RACE TECH SOLUTIONS - LOYALTY ACCOUNT',
        'Telephone Number': '0128110064',
        'EMAIL Address': 'acounts@race-tec.co.za',
        'Customer Postcode': '0056',
        'Address': '',
        'Credit Limit': '5000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'L00106',
        'Customer Name': 'BOGNE MOTORS - LOYALTY ACCOUNT',
        'Telephone Number': '0833953104',
        'EMAIL Address': 'motorcityworkshop@bognermotors.co.za',
        'Customer Postcode': '1619',
        'Address': '',
        'Credit Limit': '50000',
        'Outstanding Bal': '-1670.53'
    },
    {
        'Account Number': 'L00109',
        'Customer Name': 'GLENRIDGE MOTORS - LOYALTY ACCOUNT',
        'Telephone Number': '0123481359',
        'EMAIL Address': 'www.glenridgemotors.co.za',
        'Customer Postcode': '0186',
        'Address': '',
        'Credit Limit': '100000',
        'Outstanding Bal': '-881.5'
    },
    {
        'Account Number': 'L00112',
        'Customer Name': 'AUTO MOTION - LOYALTY ACCOUNT',
        'Telephone Number': '',
        'EMAIL Address': 'automotionworkshop@gmail.com',
        'Customer Postcode': '0121',
        'Address': '',
        'Credit Limit': '80000',
        'Outstanding Bal': '-1250.8600000000001'
    },
    {
        'Account Number': 'L00115',
        'Customer Name': 'GEOSERGIO AUTO ELECTRICAL - LOYALTY ACCOUNT',
        'Telephone Number': '0825611447',
        'EMAIL Address': 'geosergio@vodamail.co.za',
        'Customer Postcode': '0031',
        'Address': '',
        'Credit Limit': '80000',
        'Outstanding Bal': '-601.28000000000009'
    },
    {
        'Account Number': 'L00118',
        'Customer Name': 'HI TECH AUTO ELECTRICAL - LOYALTY ACCOUNT',
        'Telephone Number': '0127514270',
        'EMAIL Address': 'hitechatcenturion@gmail.com',
        'Customer Postcode': '0157',
        'Address': '',
        'Credit Limit': '70000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'L00121',
        'Customer Name': 'DAR AUTOMOTIVE - LOYALTY ACCOUNT',
        'Telephone Number': '0872374795',
        'EMAIL Address': 'jason@dargroup.co.za',
        'Customer Postcode': '6001',
        'Address': 'EASTERN CAPE',
        'Credit Limit': '',
        'Outstanding Bal': '1500000'
    },
    {
        'Account Number': 'L00124',
        'Customer Name': 'INNER CITY GEARBOX - LOYALTY ACCOUNT',
        'Telephone Number': '012 335 9193',
        'EMAIL Address': 'innercitygearbox@gmail.com',
        'Customer Postcode': '0081',
        'Address': '',
        'Credit Limit': '80000',
        'Outstanding Bal': '-6528.880000000001'
    },
    {
        'Account Number': 'L00127',
        'Customer Name': 'ACCOUNT CLOSED',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Customer Postcode': '0084',
        'Address': '',
        'Credit Limit': '0',
        'Outstanding Bal': '-67.38'
    },
    {
        'Account Number': 'L00130',
        'Customer Name': 'MIDAS HAMMANSKRAAL',
        'Telephone Number': '0127111102/3',
        'EMAIL Address': 'teitgea@gmail.com',
        'Customer Postcode': '0430',
        'Address': '',
        'Credit Limit': '100000',
        'Outstanding Bal': '-1258.6399999999999'
    },
    {
        'Account Number': 'L00133',
        'Customer Name': 'AUTO GLASS CALL CENTRE - LOYALTY ACCOUNT',
        'Telephone Number': '011 394 4478',
        'EMAIL Address': 'admin@todeon.co.za',
        'Customer Postcode': '1619',
        'Address': '',
        'Credit Limit': '120000',
        'Outstanding Bal': '-4338.8'
    },
    {
        'Account Number': 'L00136',
        'Customer Name': 'BATTERY MOB - LOYALTY ACCOUNT',
        'Telephone Number': '',
        'EMAIL Address': 'francois@signdrama.co.za',
        'Customer Postcode': '0084',
        'Address': 'GEZINA',
        'Credit Limit': '50000',
        'Outstanding Bal': '-14772.71'
    },
    {
        'Account Number': 'L00139',
        'Customer Name': 'AUTO SERVICE WORLD LOYALTY ACCOUNT',
        'Telephone Number': '012 451 5027',
        'EMAIL Address': 'autoserviceworld.hatfield@gmail.com',
        'Customer Postcode': '0028',
        'Address': '',
        'Credit Limit': '80000',
        'Outstanding Bal': '-4488.7299999999996'
    },
    {
        'Account Number': 'L00142',
        'Customer Name': 'AUTOBOYS FOURWAYS LOYALTY ACCOUNT',
        'Telephone Number': '011 028 1166',
        'EMAIL Address': 'gaugainjason12@gmail.com',
        'Customer Postcode': '2055',
        'Address': '',
        'Credit Limit': '100000',
        'Outstanding Bal': '-15063.3'
    },
    {
        'Account Number': 'L00145',
        'Customer Name': 'D.H.K. AUTOMOTOVE SERVICE LOYALTY ACCOUNT',
        'Telephone Number': '012-327-5936',
        'EMAIL Address': 'hilario@dhkgroup.co.za',
        'Customer Postcode': '0183',
        'Address': '',
        'Credit Limit': '150000',
        'Outstanding Bal': '-1548.3'
    },
    {
        'Account Number': 'L00148',
        'Customer Name': 'AUTOBOYS SOUTHDALE LOYALTY ACCOUNT',
        'Telephone Number': '011 493 9675',
        'EMAIL Address': 'izakl@autoboys.co.za',
        'Customer Postcode': '2092',
        'Address': 'JOHANNESBURG',
        'Credit Limit': '100000',
        'Outstanding Bal': '-323.37'
    },
    {
        'Account Number': 'L00151',
        'Customer Name': 'RCI GLASS ENTERPRISES LOYALTY ACCOUNT',
        'Telephone Number': '012 252 5304',
        'EMAIL Address': 'charldelange1@gmail.com',
        'Customer Postcode': '0250',
        'Address': '',
        'Credit Limit': '50000',
        'Outstanding Bal': '-5703.02'
    },
    {
        'Account Number': 'L00154',
        'Customer Name': 'G.T. MOTORS LOYALTY ACCOUNT',
        'Telephone Number': '012 321 6476',
        'EMAIL Address': 'gtmotorsmail@gmail.com',
        'Customer Postcode': '0002',
        'Address': '',
        'Credit Limit': '80000',
        'Outstanding Bal': '-2749.7300000000005'
    },
    {
        'Account Number': 'L00157',
        'Customer Name': 'EARN A CAR - LOYALTY ACCOUNT',
        'Telephone Number': '011 425 1666',
        'EMAIL Address': 'pierrevm@earnacar.co.za',
        'Customer Postcode': '1619',
        'Address': '',
        'Credit Limit': '50000',
        'Outstanding Bal': '-15664.47'
    },
    {
        'Account Number': 'L00160',
        'Customer Name': 'CENCAR LOYALTY ACCOUNT',
        'Telephone Number': '012 653 3155',
        'EMAIL Address': 'info@cencar.co.za',
        'Customer Postcode': '0014',
        'Address': '',
        'Credit Limit': '50000',
        'Outstanding Bal': '-4243.34'
    },
    {
        'Account Number': 'L00163',
        'Customer Name': 'GERMO PARTS - LOYALTY ACCOUNT',
        'Telephone Number': '012 252 0426',
        'EMAIL Address': 'info@germoparts.co.za',
        'Customer Postcode': '0250',
        'Address': '',
        'Credit Limit': '100000',
        'Outstanding Bal': '-2189.2800000000002'
    },
    {
        'Account Number': 'L00166',
        'Customer Name': 'DZUNDE AUTO SOLUTIONS - LOYALTY ACCOUNT',
        'Telephone Number': '012 327 5234',
        'EMAIL Address': 'dzunde@hotmail.co.za',
        'Customer Postcode': '0183',
        'Address': 'PRETORIA',
        'Credit Limit': '',
        'Outstanding Bal': '80000'
    },
    {
        'Account Number': 'L00169',
        'Customer Name': 'SUPREME TECHNICAL SERVICES (PTY) LTD LOYALTY',
        'Telephone Number': '012 252 3452',
        'EMAIL Address': 'chris@supremebrake.co.za',
        'Customer Postcode': '0250',
        'Address': '',
        'Credit Limit': '150000',
        'Outstanding Bal': '-569.45000000000005'
    },
    {
        'Account Number': 'L00172',
        'Customer Name': 'WELLE AUTOMOTIVE ENGINEERING LOYALTY ACCOUNT',
        'Telephone Number': '011 793 4119',
        'EMAIL Address': 'welle@mweb.co.za',
        'Customer Postcode': '2194',
        'Address': '',
        'Credit Limit': '60000',
        'Outstanding Bal': '-450'
    },
    {
        'Account Number': 'L00175',
        'Customer Name': 'DEUTSCH AUTO CENTRE - LOYALTY ACCOUNT',
        'Telephone Number': '011 440 6577',
        'EMAIL Address': 'anil@deutschauto.co.za',
        'Customer Postcode': '2196',
        'Address': '',
        'Credit Limit': '30000',
        'Outstanding Bal': '-665.21'
    },
    {
        'Account Number': 'L00178',
        'Customer Name': 'BROEDERSTROOM GARAGE LOYALTY ACCOUNT',
        'Telephone Number': '012 001 3703',
        'EMAIL Address': 'corrief@polka.co.za',
        'Customer Postcode': '0240',
        'Address': 'NORTH WEST',
        'Credit Limit': '',
        'Outstanding Bal': '60000'
    },
    {
        'Account Number': 'L00181',
        'Customer Name': 'HI-Q AIRPORT LOYALTY ACCOUNT',
        'Telephone Number': '011 394 1010',
        'EMAIL Address': 'ryan@airporttyres.co.za',
        'Customer Postcode': '1619',
        'Address': '',
        'Credit Limit': '50000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'L00184',
        'Customer Name': 'MONTEDI MOTOR CLINIC LOYALTY ACCOUNT',
        'Telephone Number': '011 051 6742',
        'EMAIL Address': 'montedimotors@gmail.com',
        'Customer Postcode': '1685',
        'Address': 'MIDRAND',
        'Credit Limit': '',
        'Outstanding Bal': '20000'
    },
    {
        'Account Number': 'L00187',
        'Customer Name': 'TURBOWORKS LOYALTY ACCOUNT',
        'Telephone Number': '012 653 7507',
        'EMAIL Address': 'sales2@turboworks.co.za',
        'Customer Postcode': '0157',
        'Address': 'CENTURION',
        'Credit Limit': 'PRETORIA',
        'Outstanding Bal': '40000'
    },
    {
        'Account Number': 'L00190',
        'Customer Name': 'EARN A CAR PANELBEATERS LOYALTY ACCOUNT',
        'Telephone Number': '011 425 1666',
        'EMAIL Address': 'mariusdp3@gmail.com',
        'Customer Postcode': '1619',
        'Address': '',
        'Credit Limit': '20000',
        'Outstanding Bal': '-2244.8999999999996'
    },
    {
        'Account Number': 'L00193',
        'Customer Name': 'FAST SERV HAZELWOOD',
        'Telephone Number': '012 346 6450',
        'EMAIL Address': 'fastservauto@gmail.com',
        'Customer Postcode': '1997',
        'Address': 'PRETORIA',
        'Credit Limit': '5000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'L00196',
        'Customer Name': 'TURF AUTO SERVICES LOYALTY ACCOUNT',
        'Telephone Number': '011 683 1300',
        'EMAIL Address': 'michael@turfauto.co.za',
        'Customer Postcode': '2190',
        'Address': '',
        'Credit Limit': '40000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'L00199',
        'Customer Name': 'R2R AUTO SERVICE (PTY) LTD LOYALTY ACCOUNT',
        'Telephone Number': '076 263 1715',
        'EMAIL Address': 'r2rautoservice@gmail.com',
        'Customer Postcode': '0157',
        'Address': '',
        'Credit Limit': '100000',
        'Outstanding Bal': '-1432.48'
    },
    {
        'Account Number': 'L00202',
        'Customer Name': 'ANDRé CHANGUION',
        'Telephone Number': '',
        'EMAIL Address': 'andre@moveholdings.co.za',
        'Customer Postcode': '0042',
        'Address': 'PRETORIA',
        'Credit Limit': '40000',
        'Outstanding Bal': '-24.75'
    },
    {
        'Account Number': 'L00205',
        'Customer Name': 'SUZUKI MONTANA',
        'Telephone Number': '010 599 5200',
        'EMAIL Address': 'riaan@pentamotorgroup.co.za',
        'Customer Postcode': ' dawid@pentamotorgroup.co.za',
        'Address': '',
        'Credit Limit': 'PRETORIA',
        'Outstanding Bal': '100000'
    },
    {
        'Account Number': 'L00208',
        'Customer Name': 'THE PARTNER\'S WORKSHOP',
        'Telephone Number': '011 440 5406',
        'EMAIL Address': 'peterkol@iafrica.com',
        'Customer Postcode': '2028',
        'Address': 'JOHANNESBURG',
        'Credit Limit': '140000',
        'Outstanding Bal': '-798.48'
    },
    {
        'Account Number': 'L00211',
        'Customer Name': 'TSWELOPELE AUTO ELECTRICAL',
        'Telephone Number': '011 316 5452',
        'EMAIL Address': 'mte@polka.co.za',
        'Customer Postcode': '1606',
        'Address': 'PRETORIA',
        'Credit Limit': '200000',
        'Outstanding Bal': '-828.52'
    },
    {
        'Account Number': 'L00214',
        'Customer Name': 'E.R. AUTO ELECTRICAL SERVICES LOYALTY ACCOUNT',
        'Telephone Number': '012 330 0390',
        'EMAIL Address': 'erautolec@gmail.com',
        'Customer Postcode': '0183',
        'Address': 'PRETORIA',
        'Credit Limit': '5000',
        'Outstanding Bal': '-151.5'
    },
    {
        'Account Number': 'L00217',
        'Customer Name': 'INTERFIX 1 AUTO PROFS (PTY) LTD',
        'Telephone Number': '012 546 0742',
        'EMAIL Address': 'interfix1@telkomsa.net',
        'Customer Postcode': '0182',
        'Address': 'PRETORIA',
        'Credit Limit': '300000',
        'Outstanding Bal': '-3938.3500000000004'
    },
    {
        'Account Number': 'L00220',
        'Customer Name': 'OPTIMA AUTO LOYALTY ACCOUNT',
        'Telephone Number': '012 546 4503',
        'EMAIL Address': 'ernest@optimaauto.co.za',
        'Customer Postcode': '0182',
        'Address': 'PRETORIA',
        'Credit Limit': '400000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'L00223',
        'Customer Name': 'BASHEWA MOTOTRS LOYALTY ACCOUNT',
        'Telephone Number': '082 850 3124',
        'EMAIL Address': 'jschinkel@vodamail.co.za',
        'Customer Postcode': '0056',
        'Address': 'PRETORIA',
        'Credit Limit': '5000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'L00226',
        'Customer Name': 'ROELF KRUGER AUTO LOYALTY ACCOUNT',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Customer Postcode': '1001',
        'Address': 'GAUTENG',
        'Credit Limit': '5000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'L00235',
        'Customer Name': 'MECHSPECH AUTO LOYALTY ACCOUNT',
        'Telephone Number': '011 805 3640',
        'EMAIL Address': 'cheryl@mechspec.org',
        'Customer Postcode': '1685',
        'Address': 'HALFWAY HOUSE',
        'Credit Limit': 'GAUTENG',
        'Outstanding Bal': '5000'
    },
    {
        'Account Number': 'L10004',
        'Customer Name': 'HENRY MOTORS LOYATLY ACCOUNT',
        'Telephone Number': '012 348 42204',
        'EMAIL Address': 'admin@henrymotors.co.za',
        'Customer Postcode': '',
        'Address': 'GAUTENG',
        'Credit Limit': '200000',
        'Outstanding Bal': '-13258.239999999998'
    },
    {
        'Account Number': 'L10019',
        'Customer Name': 'HATTINGH MOTORS LOYALTY ACCOUNT',
        'Telephone Number': '012 663 6477',
        'EMAIL Address': 'vera@hattinghmotors.co.za',
        'Customer Postcode': '0157',
        'Address': '',
        'Credit Limit': '500000',
        'Outstanding Bal': '-22231.359999999997'
    },
    {
        'Account Number': 'L10058',
        'Customer Name': 'TRANSPORT MOTOR REPAIRS LOYALTY ACCOUNT',
        'Telephone Number': '012 329 1410',
        'EMAIL Address': 'tmr1@vodamail.co.za',
        'Customer Postcode': '8084',
        'Address': '',
        'Credit Limit': '150000',
        'Outstanding Bal': '-18172.400000000001'
    },
    {
        'Account Number': 'M00000',
        'Customer Name': 'AR CONV TEMP ERRORS',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Customer Postcode': '1000',
        'Address': '',
        'Credit Limit': '5000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'M00001',
        'Customer Name': 'M-CENTRE',
        'Telephone Number': '012 653 7855',
        'EMAIL Address': 'lesm@m-centre.co.za',
        'Customer Postcode': '0157',
        'Address': 'PRETORIA',
        'Credit Limit': '500000',
        'Outstanding Bal': '372825.29'
    },
    {
        'Account Number': 'M00004',
        'Customer Name': 'HENRY MOTORS',
        'Telephone Number': '012 348 4204',
        'EMAIL Address': 'admin@henrymotors.co.za',
        'Customer Postcode': '',
        'Address': '',
        'Credit Limit': '200000',
        'Outstanding Bal': '166.75000000002183'
    },
    {
        'Account Number': 'M00007',
        'Customer Name': 'ROYAL MAINTENTANCE',
        'Telephone Number': '012 803 7727',
        'EMAIL Address': 'admin@royalmaintenance.co.za',
        'Customer Postcode': '0081',
        'Address': 'PRETORIA',
        'Credit Limit': '400000',
        'Outstanding Bal': '3420.14'
    },
    {
        'Account Number': 'M00010',
        'Customer Name': 'KGABOTSE FIELD REPAIRS',
        'Telephone Number': '012 546 7546',
        'EMAIL Address': 'kgabotse@lantic.net',
        'Customer Postcode': '0182',
        'Address': 'PRETORIA',
        'Credit Limit': '400000',
        'Outstanding Bal': '-11168.38'
    },
    {
        'Account Number': 'M00013',
        'Customer Name': 'KL SERVICES',
        'Telephone Number': '012 661 5692',
        'EMAIL Address': 'klservices.za@gmail.com',
        'Customer Postcode': '0046',
        'Address': 'PRETORIA',
        'Credit Limit': '440000',
        'Outstanding Bal': '16870.53'
    },
    {
        'Account Number': 'M00016',
        'Customer Name': 'JJ VELDDIENSTE',
        'Telephone Number': '012 804 4987',
        'EMAIL Address': 'jjvelddienste@gmail.com',
        'Customer Postcode': '0184',
        'Address': 'PRETORIA',
        'Credit Limit': '300000',
        'Outstanding Bal': '4482.16'
    },
    {
        'Account Number': 'M00019',
        'Customer Name': 'HATTINGH MOTORS',
        'Telephone Number': '012 663 6477',
        'EMAIL Address': 'vera@hattinghmotors.co.za',
        'Customer Postcode': '0157',
        'Address': '',
        'Credit Limit': '500000',
        'Outstanding Bal': '346308.51'
    },
    {
        'Account Number': 'M00022',
        'Customer Name': 'KOKKIES PERFORMANCE CENTRE',
        'Telephone Number': '012 804 9416',
        'EMAIL Address': 'kokkiesautocentre@gmail.com',
        'Customer Postcode': '0184',
        'Address': 'PRETORIA',
        'Credit Limit': '240000',
        'Outstanding Bal': '25865.919999999998'
    },
    {
        'Account Number': 'M00025',
        'Customer Name': 'GEARBOX & DIFF REBUILDING',
        'Telephone Number': '012 327 1275',
        'EMAIL Address': 'abooyse@gearbox-diff.co.za',
        'Customer Postcode': '0183',
        'Address': 'PRETORIA',
        'Credit Limit': '400000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'M00028',
        'Customer Name': 'MENLYN MOTOR SERVICES',
        'Telephone Number': '012 348 3090',
        'EMAIL Address': 'mag@menlynmotorservices.co.za',
        'Customer Postcode': '0181',
        'Address': 'PRETORIA',
        'Credit Limit': '300000',
        'Outstanding Bal': '17528.539999999994'
    },
    {
        'Account Number': 'M00031',
        'Customer Name': 'YOUR MOTOR CLINIC',
        'Telephone Number': '012 846 7021',
        'EMAIL Address': 'sharonjoubert@ymail.com',
        'Customer Postcode': '0184',
        'Address': 'PRETORIA',
        'Credit Limit': '240000',
        'Outstanding Bal': '55937.710000000014'
    },
    {
        'Account Number': 'M00034',
        'Customer Name': 'CAR VAN TRUCK',
        'Telephone Number': '012 662 1296',
        'EMAIL Address': 'suecoetzee@yebo.co.za',
        'Customer Postcode': '0157',
        'Address': 'PRETORIA',
        'Credit Limit': '200000',
        'Outstanding Bal': '1493.26'
    },
    {
        'Account Number': 'M00037',
        'Customer Name': 'JT CAR SERVICE',
        'Telephone Number': '012 997 2422',
        'EMAIL Address': 'jtcarservice@netmobile.co.za',
        'Customer Postcode': '0044',
        'Address': 'PRETORIA',
        'Credit Limit': '140000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'M00040',
        'Customer Name': 'AUTOZONE WONDERBOOM',
        'Telephone Number': '012 567 1073',
        'EMAIL Address': 'autozonewonderboom@yahoo.com',
        'Customer Postcode': '0182',
        'Address': 'PRETORIA',
        'Credit Limit': '200000',
        'Outstanding Bal': '31008.710000000006'
    },
    {
        'Account Number': 'M00043',
        'Customer Name': 'N1 4x4',
        'Telephone Number': '012 545 0200',
        'EMAIL Address': 'admin@n14x4.co.za',
        'Customer Postcode': '0120',
        'Address': 'PRETORIA',
        'Credit Limit': '440000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'M00046',
        'Customer Name': 'FAERIE GLEN MOTOR CLINIC',
        'Telephone Number': '012 991 4724',
        'EMAIL Address': 'fgmotorclinic@live.co.za',
        'Customer Postcode': '0043',
        'Address': 'PRETORIA',
        'Credit Limit': '300000',
        'Outstanding Bal': '53649.939999999995'
    },
    {
        'Account Number': 'M00049',
        'Customer Name': 'LPM TRADING',
        'Telephone Number': '012 666 8128',
        'EMAIL Address': 'joanita@lpm.co.za',
        'Customer Postcode': '0157',
        'Address': 'PRETORIA',
        'Credit Limit': '150000',
        'Outstanding Bal': '81292.899999999994'
    },
    {
        'Account Number': 'M00052',
        'Customer Name': 'JORGE\'S AUTO CLINIC',
        'Telephone Number': '012 993 2021',
        'EMAIL Address': 'jkmraraujo@gmail.com',
        'Customer Postcode': '0181',
        'Address': 'PRETORIA',
        'Credit Limit': '200000',
        'Outstanding Bal': '23480.93'
    },
    {
        'Account Number': 'M00055',
        'Customer Name': 'MOOTORIA',
        'Telephone Number': '012 331 1890',
        'EMAIL Address': 'mootoriamh@gmail.com',
        'Customer Postcode': '0084',
        'Address': 'PRETORIA',
        'Credit Limit': '200000',
        'Outstanding Bal': '12951.34'
    },
    {
        'Account Number': 'M00058',
        'Customer Name': 'TRANSPORT MOTOR REPAIRS',
        'Telephone Number': '012 329 1410',
        'EMAIL Address': 'tmr1@vodamail.co.za',
        'Customer Postcode': '8084',
        'Address': 'PRETORIA',
        'Credit Limit': '150000',
        'Outstanding Bal': '11389.700000000015'
    },
    {
        'Account Number': 'M00061',
        'Customer Name': 'KOOPS',
        'Telephone Number': '012 335 3333',
        'EMAIL Address': 'admin@koops.co.za',
        'Customer Postcode': '0084',
        'Address': 'PRETORIA',
        'Credit Limit': '300000',
        'Outstanding Bal': '5258.3899999999994'
    },
    {
        'Account Number': 'M00064',
        'Customer Name': 'ACD GEZINA VOORTREKKER VALUE SERVE',
        'Telephone Number': '012 335 1971',
        'EMAIL Address': 'voortrekkervalueserve@telkomsa.net',
        'Customer Postcode': '0037',
        'Address': 'PRETORIA',
        'Credit Limit': '240000',
        'Outstanding Bal': '13978.64'
    },
    {
        'Account Number': 'M00067',
        'Customer Name': 'STOMAN MOTORS',
        'Telephone Number': '',
        'EMAIL Address': 'stomanmotors@hotmail.com',
        'Customer Postcode': '0046',
        'Address': 'PRETORIA',
        'Credit Limit': '100000',
        'Outstanding Bal': '88974.04'
    },
    {
        'Account Number': 'M00070',
        'Customer Name': 'LA MONTAGNE MOTORS',
        'Telephone Number': '012 803 4734',
        'EMAIL Address': 'lamontagnemotors@gmail.com',
        'Customer Postcode': '0184',
        'Address': 'PRETORIA',
        'Credit Limit': '100000',
        'Outstanding Bal': '38887.919999999991'
    },
    {
        'Account Number': 'M00074',
        'Customer Name': 'VEHICLE WHISPERER',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Customer Postcode': '',
        'Address': '',
        'Credit Limit': '0',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'M00076',
        'Customer Name': 'FASTSERV AUTO',
        'Telephone Number': '012 333 6094',
        'EMAIL Address': 'fastservauto@gmail.com',
        'Customer Postcode': '0186',
        'Address': 'PRETORIA',
        'Credit Limit': '300000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'M00079',
        'Customer Name': 'ADVANCED AUTO',
        'Telephone Number': '012 653 0247',
        'EMAIL Address': 'bookings@advancedautomotive.co.za',
        'Customer Postcode': '0157',
        'Address': 'PRETORIA',
        'Credit Limit': '200000',
        'Outstanding Bal': '1819.9'
    },
    {
        'Account Number': 'M00082',
        'Customer Name': 'ACD FRIK NEL MOTORS',
        'Telephone Number': '012 654 6424',
        'EMAIL Address': 'acdwierda@gmail.com',
        'Customer Postcode': '0134',
        'Address': 'PRETORIA',
        'Credit Limit': '140000',
        'Outstanding Bal': '30294.770000000008'
    },
    {
        'Account Number': 'M00085',
        'Customer Name': 'AUTO DOCTORS',
        'Telephone Number': '012 379 4352',
        'EMAIL Address': 'rachel@autodoctor.co.za',
        'Customer Postcode': '0082',
        'Address': 'PRETORIA',
        'Credit Limit': '240000',
        'Outstanding Bal': '48610.189999999988'
    },
    {
        'Account Number': 'M00088',
        'Customer Name': 'PETER\'S AUTO CARE',
        'Telephone Number': '011 828 5835',
        'EMAIL Address': 'petersauto@telkomsa.net',
        'Customer Postcode': '1401',
        'Address': 'JOHANNESBURG',
        'Credit Limit': '300000',
        'Outstanding Bal': '70157.329999999987'
    },
    {
        'Account Number': 'M00091',
        'Customer Name': 'AUTOBOYS WONDERBOOM',
        'Telephone Number': '012 942 9385',
        'EMAIL Address': 'hennied@autoboys.co.za',
        'Customer Postcode': ' ianv@autoboys.co.za',
        'Address': '',
        'Credit Limit': 'PRETORIA',
        'Outstanding Bal': '400000'
    },
    {
        'Account Number': 'M00094',
        'Customer Name': 'VENTER GEARBOX',
        'Telephone Number': '012 545 4131/2',
        'EMAIL Address': 'ventergd@telkomsa.net',
        'Customer Postcode': '0120',
        'Address': 'PRETORIA',
        'Credit Limit': '300000',
        'Outstanding Bal': '19377.7'
    },
    {
        'Account Number': 'M00097',
        'Customer Name': 'SPEED WORKS',
        'Telephone Number': '012 991 4537',
        'EMAIL Address': 'alan@speedworx-pta.co.za',
        'Customer Postcode': '0043',
        'Address': 'PRETORIA',
        'Credit Limit': '160000',
        'Outstanding Bal': '39640.48000000001'
    },
    {
        'Account Number': 'M00100',
        'Customer Name': 'BEAT BOYS',
        'Telephone Number': '012 335 4242',
        'EMAIL Address': 'gert.pretorius@yahoo.com',
        'Customer Postcode': '0174',
        'Address': 'PRETORIA',
        'Credit Limit': '200000',
        'Outstanding Bal': '15459.54'
    },
    {
        'Account Number': 'M00103',
        'Customer Name': 'RACE TEC SOLUTIONS',
        'Telephone Number': '012 811 0064',
        'EMAIL Address': 'accounts@race-tec.co.za',
        'Customer Postcode': '0056',
        'Address': 'PRETORIA',
        'Credit Limit': '100000',
        'Outstanding Bal': '1000'
    },
    {
        'Account Number': 'M00106',
        'Customer Name': 'BOGNER MOTOR CITY WORKSHOP',
        'Telephone Number': '011 394 1963',
        'EMAIL Address': 'andrea@bognermotors.co.za',
        'Customer Postcode': '1620',
        'Address': 'GAUTENG',
        'Credit Limit': '100000',
        'Outstanding Bal': '52573.68'
    },
    {
        'Account Number': 'M00109',
        'Customer Name': 'GLENRIDGE MOTORS',
        'Telephone Number': '012 348 1359',
        'EMAIL Address': 'info@glenridgemotors.co.za',
        'Customer Postcode': '0186',
        'Address': 'PRETORIA',
        'Credit Limit': '200000',
        'Outstanding Bal': '1232.5600000000002'
    },
    {
        'Account Number': 'M00112',
        'Customer Name': 'AUTO MOTION',
        'Telephone Number': '',
        'EMAIL Address': 'automotionworkshop@hotmail.com',
        'Customer Postcode': '0084',
        'Address': 'PRETORIA',
        'Credit Limit': '160000',
        'Outstanding Bal': '27851.290000000005'
    },
    {
        'Account Number': 'M00115',
        'Customer Name': 'GEOSERGIO AUTO ELECTRICAL CC',
        'Telephone Number': '012 335 9118',
        'EMAIL Address': 'geosergio@vodamail.co.za',
        'Customer Postcode': '0031',
        'Address': 'PRETORIA',
        'Credit Limit': '100000',
        'Outstanding Bal': '11388.25'
    },
    {
        'Account Number': 'M00118',
        'Customer Name': 'HI TECH AUTO ELECTRICAL',
        'Telephone Number': '012 751 4270',
        'EMAIL Address': 'hitechatcenturion@gmail.com',
        'Customer Postcode': '0046',
        'Address': 'PRETORIA',
        'Credit Limit': '140000',
        'Outstanding Bal': '2000'
    },
    {
        'Account Number': 'M00121',
        'Customer Name': 'DAR AUTOMOTIVE',
        'Telephone Number': '087 237 4795',
        'EMAIL Address': 'jason@dargroup.co.za',
        'Customer Postcode': '6001',
        'Address': 'PORT ELIZABETH',
        'Credit Limit': '3000000',
        'Outstanding Bal': '650884.63000000035'
    },
    {
        'Account Number': 'M00124',
        'Customer Name': 'Inner City Gearbox',
        'Telephone Number': '012 335 9193',
        'EMAIL Address': 'innercitygearbox@gmail.com',
        'Customer Postcode': '0081',
        'Address': 'PRETORIA',
        'Credit Limit': '160000',
        'Outstanding Bal': '3839.579999999999'
    },
    {
        'Account Number': 'M00127',
        'Customer Name': 'ACCOUNT CLOSED',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Customer Postcode': '0084',
        'Address': '',
        'Credit Limit': '0',
        'Outstanding Bal': '-1890.0300000000002'
    },
    {
        'Account Number': 'M00130',
        'Customer Name': 'MIDAS HAMMANSKRAAL',
        'Telephone Number': '012 711 1102/3',
        'EMAIL Address': 'teitgea@gmail.com',
        'Customer Postcode': '0430',
        'Address': 'PRETORIA',
        'Credit Limit': '200000',
        'Outstanding Bal': '44689.280000000013'
    },
    {
        'Account Number': 'M00133',
        'Customer Name': 'Auto Glass Call Centre',
        'Telephone Number': '011 394 4478',
        'EMAIL Address': 'admin@todeon.co.za',
        'Customer Postcode': '1619',
        'Address': 'JOHANNESBURG',
        'Credit Limit': '240000',
        'Outstanding Bal': '54489.900000000009'
    },
    {
        'Account Number': 'M00136',
        'Customer Name': 'Battery Mob',
        'Telephone Number': '083 391 1734',
        'EMAIL Address': 'francois@signarama.co.za',
        'Customer Postcode': '0084',
        'Address': 'PRETORIA',
        'Credit Limit': '100000',
        'Outstanding Bal': '279832.94999999995'
    },
    {
        'Account Number': 'M00139',
        'Customer Name': 'AUTO SERVICE WORLD',
        'Telephone Number': '012 451 5027',
        'EMAIL Address': 'autoserviceworld.hatfield@gmail.com',
        'Customer Postcode': '0028',
        'Address': 'PRETORIA',
        'Credit Limit': '160000',
        'Outstanding Bal': '49423.910000000018'
    },
    {
        'Account Number': 'M00142',
        'Customer Name': 'AUTOBOYS FOURWAYS',
        'Telephone Number': '011 028 1166',
        'EMAIL Address': 'gaugainjason12@gmail.com',
        'Customer Postcode': '2055',
        'Address': 'JOHANNESBURG',
        'Credit Limit': '100000',
        'Outstanding Bal': '59413.279999999999'
    },
    {
        'Account Number': 'M00145',
        'Customer Name': 'D.H.K. AUTOMOTIVE SERVICE',
        'Telephone Number': '012 327 5936',
        'EMAIL Address': 'leandro@dhkgroup.co.za',
        'Customer Postcode': '0183',
        'Address': 'PRETORIA',
        'Credit Limit': '300000',
        'Outstanding Bal': '18960.97'
    },
    {
        'Account Number': 'M00148',
        'Customer Name': 'AUTOBOYS SOUTHDALE',
        'Telephone Number': '011 493 9675',
        'EMAIL Address': 'izakl@autoboys.co.za',
        'Customer Postcode': 'ianv@autoboys.co.za',
        'Address': '',
        'Credit Limit': 'JOHANNESBURG',
        'Outstanding Bal': '200000'
    },
    {
        'Account Number': 'M00151',
        'Customer Name': 'RCI GLASS ENTERPRISES',
        'Telephone Number': '012 252 5304',
        'EMAIL Address': 'charldelange1@gmail.com',
        'Customer Postcode': '0250',
        'Address': 'BRITS',
        'Credit Limit': '200000',
        'Outstanding Bal': '61567.71'
    },
    {
        'Account Number': 'M00154',
        'Customer Name': 'G.T. MOTORS',
        'Telephone Number': '012 321 6476',
        'EMAIL Address': 'gtmotorsmail@gmail.com',
        'Customer Postcode': '0002',
        'Address': 'PRETORIA',
        'Credit Limit': '160000',
        'Outstanding Bal': '9426.82'
    },
    {
        'Account Number': 'M00157',
        'Customer Name': 'EARN A CAR',
        'Telephone Number': '011 425 1666',
        'EMAIL Address': 'dawnc@earnacar.co.za',
        'Customer Postcode': ' cmaule@cobaltcapital.co.za',
        'Address': '',
        'Credit Limit': 'JOHANNESBURG',
        'Outstanding Bal': '100000'
    },
    {
        'Account Number': 'M00160',
        'Customer Name': 'CENCAR',
        'Telephone Number': '012 653 3155',
        'EMAIL Address': 'info@cencar.co.za',
        'Customer Postcode': '0014',
        'Address': 'PRETORIA',
        'Credit Limit': '100000',
        'Outstanding Bal': '74248.74000000002'
    },
    {
        'Account Number': 'M00163',
        'Customer Name': 'GERMO PARTS',
        'Telephone Number': '012 252 0426',
        'EMAIL Address': 'info@germoparts.co.za',
        'Customer Postcode': '0250',
        'Address': 'BRITS',
        'Credit Limit': '300000',
        'Outstanding Bal': '74637.88'
    },
    {
        'Account Number': 'M00166',
        'Customer Name': 'DZUNDE AUTO SOLUTIONS',
        'Telephone Number': '012 327 5234',
        'EMAIL Address': 'dzunde@hotmail.com',
        'Customer Postcode': '0183',
        'Address': 'PRETORIA WEST',
        'Credit Limit': 'PRETORIA',
        'Outstanding Bal': '160000'
    },
    {
        'Account Number': 'M00169',
        'Customer Name': 'SUPREME TECHNICAL SERVICES (PTY) LTD',
        'Telephone Number': '012 252 3452',
        'EMAIL Address': 'chris@supremebrake.co.za',
        'Customer Postcode': '0250',
        'Address': 'BRITS',
        'Credit Limit': '300000',
        'Outstanding Bal': '6415.1100000000015'
    },
    {
        'Account Number': 'M00172',
        'Customer Name': 'WELLE AUTOMOTIVE ENGINEERING',
        'Telephone Number': '011 793 4119',
        'EMAIL Address': 'welle@mweb.co.za',
        'Customer Postcode': '2194',
        'Address': 'JOHANNESBURG',
        'Credit Limit': '120000',
        'Outstanding Bal': '30256.29'
    },
    {
        'Account Number': 'M00175',
        'Customer Name': 'DEUTSCH AUTO CENTRE',
        'Telephone Number': '011 440 6577',
        'EMAIL Address': 'anil@deutschauto.co.za',
        'Customer Postcode': '2196',
        'Address': 'JOHANNESBURG',
        'Credit Limit': '60000',
        'Outstanding Bal': '1647.74'
    },
    {
        'Account Number': 'M00178',
        'Customer Name': 'BROEDERSTROOM GARAGE',
        'Telephone Number': '012 001 3703',
        'EMAIL Address': 'corrief@polka.co.za',
        'Customer Postcode': '0240',
        'Address': '',
        'Credit Limit': 'BROEDERSTROOM',
        'Outstanding Bal': '100000'
    },
    {
        'Account Number': 'M00181',
        'Customer Name': 'HI-Q AIRPORT',
        'Telephone Number': '011 394 1010',
        'EMAIL Address': 'ryan@airporttyres.co.za',
        'Customer Postcode': '1619',
        'Address': 'JOHANNESBURG',
        'Credit Limit': '100000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'M00184',
        'Customer Name': 'MONTEDI MOTOR CLINIC',
        'Telephone Number': '011 051 6742',
        'EMAIL Address': 'montedimotors@gmail.com',
        'Customer Postcode': '1685',
        'Address': 'MIDRAND',
        'Credit Limit': 'JOHANNESBURG',
        'Outstanding Bal': '40000'
    },
    {
        'Account Number': 'M00187',
        'Customer Name': 'TURBOWORKS',
        'Telephone Number': '012 653 7507',
        'EMAIL Address': 'sales@turboworks.co.za',
        'Customer Postcode': '0157',
        'Address': 'CENTURION',
        'Credit Limit': 'PRETORIA',
        'Outstanding Bal': '140000'
    },
    {
        'Account Number': 'M00190',
        'Customer Name': 'EARN A CAR PANELBEATERS',
        'Telephone Number': '011 425 1666',
        'EMAIL Address': 'mariusdp3@gmail.com',
        'Customer Postcode': '1619',
        'Address': 'JOHANNESBURG',
        'Credit Limit': '400000',
        'Outstanding Bal': '235218.54000000007'
    },
    {
        'Account Number': 'M00193',
        'Customer Name': 'FAST SERV AUTO HAZELWOOD',
        'Telephone Number': '012 346 6450',
        'EMAIL Address': 'fastservauto@gmail.com',
        'Customer Postcode': '1997',
        'Address': 'PRETORIA',
        'Credit Limit': '140000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'M00196',
        'Customer Name': 'TURF AUTO SERVICES',
        'Telephone Number': '011 683 1300',
        'EMAIL Address': 'michael@turfauto.co.za',
        'Customer Postcode': '2190',
        'Address': 'JOHANNESBURG',
        'Credit Limit': '80000',
        'Outstanding Bal': '2935.5299999999997'
    },
    {
        'Account Number': 'M00199',
        'Customer Name': 'R2R AUTO SERVICE (PTY) LTD',
        'Telephone Number': '076 263 1715',
        'EMAIL Address': 'r2rautoservice@gmail.com',
        'Customer Postcode': '0157',
        'Address': '',
        'Credit Limit': '25000',
        'Outstanding Bal': '32576.789999999994'
    },
    {
        'Account Number': 'M00202',
        'Customer Name': 'ANDRé CHANGUION',
        'Telephone Number': '',
        'EMAIL Address': 'andre@moveholdings.co.za',
        'Customer Postcode': '0042',
        'Address': 'PRETORIA',
        'Credit Limit': '40000',
        'Outstanding Bal': '-97.75'
    },
    {
        'Account Number': 'M00205',
        'Customer Name': 'SUZUKI MONTANA',
        'Telephone Number': '010 599 5200',
        'EMAIL Address': 'riaan@pentamotorgroup.co.za',
        'Customer Postcode': ' dawid@pentamotorgroup.co.za',
        'Address': '',
        'Credit Limit': 'PRETORIA',
        'Outstanding Bal': '100000'
    },
    {
        'Account Number': 'M00208',
        'Customer Name': 'THE PARTNER\'S WORKSHOP',
        'Telephone Number': '011 440 5406',
        'EMAIL Address': 'peterkol@iafrica.com',
        'Customer Postcode': '2028',
        'Address': 'JOHANNESBURG',
        'Credit Limit': '140000',
        'Outstanding Bal': '51860.990000000005'
    },
    {
        'Account Number': 'M00211',
        'Customer Name': 'TSWELOPELE AUTO ELECTRICAL',
        'Telephone Number': '011 316 5452',
        'EMAIL Address': 'mte@polka.co.za;danny@midrandtruck.co.za',
        'Customer Postcode': '1606',
        'Address': 'PRETORIA',
        'Credit Limit': '200000',
        'Outstanding Bal': '120939.52000000002'
    },
    {
        'Account Number': 'M00214',
        'Customer Name': 'E.R. AUTO ELECTRICAL SERVICES',
        'Telephone Number': '012 330 0390',
        'EMAIL Address': 'erautolec@gmail.com',
        'Customer Postcode': '0183',
        'Address': 'PRETORIA',
        'Credit Limit': '100000',
        'Outstanding Bal': '7816.32'
    },
    {
        'Account Number': 'M00217',
        'Customer Name': 'INTERFIX 1 AUTO PROFS (PTY) LTD',
        'Telephone Number': '012 546 0742',
        'EMAIL Address': 'interfix1@telkomsa.net',
        'Customer Postcode': '0182',
        'Address': 'PRETORIA',
        'Credit Limit': '300000',
        'Outstanding Bal': '-42204.73'
    },
    {
        'Account Number': 'M00220',
        'Customer Name': 'OPTIMA AUTO',
        'Telephone Number': '012 546 4503',
        'EMAIL Address': 'ernest@optimaauto.co.za',
        'Customer Postcode': '0182',
        'Address': 'PRETORIA',
        'Credit Limit': '400000',
        'Outstanding Bal': '23431.010000000002'
    },
    {
        'Account Number': 'M00223',
        'Customer Name': 'BASHEWA MOTORS',
        'Telephone Number': '082 850 3124',
        'EMAIL Address': 'jschinkel@vodamail.co.za',
        'Customer Postcode': '0056',
        'Address': 'PRETORIA',
        'Credit Limit': '100000',
        'Outstanding Bal': '555'
    },
    {
        'Account Number': 'M00226',
        'Customer Name': 'ROELF KRUGER AUTO REPAIRS',
        'Telephone Number': '012 734 5002',
        'EMAIL Address': 'autorepairs@roelfkrugergroup.co.za',
        'Customer Postcode': '1001',
        'Address': 'GAUTENG',
        'Credit Limit': '200000',
        'Outstanding Bal': '491.83'
    },
    {
        'Account Number': 'M00232',
        'Customer Name': 'SCOTTY\'S AUTO (PTY) LTD',
        'Telephone Number': '012 664 6869',
        'EMAIL Address': 'autoscottys@gmail.com',
        'Customer Postcode': '2003',
        'Address': 'GAUTENG',
        'Credit Limit': ' 0157',
        'Outstanding Bal': '160000'
    },
    {
        'Account Number': 'M00235',
        'Customer Name': 'MECHSPECH AUTO',
        'Telephone Number': '011 805 3640',
        'EMAIL Address': 'cheryl@mechspec.org',
        'Customer Postcode': '1685',
        'Address': 'HALFWAY HOUSE',
        'Credit Limit': 'GAUTENG',
        'Outstanding Bal': '40000'
    },
    {
        'Account Number': 'M00244',
        'Customer Name': 'MURRAY BROS',
        'Telephone Number': '074 877 6443',
        'EMAIL Address': 'senetfokdit@gmail.com',
        'Customer Postcode': '1541',
        'Address': 'GAUTENG',
        'Credit Limit': '100000',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'M10004',
        'Customer Name': 'HENRY MOTORS',
        'Telephone Number': '012 348 4204',
        'EMAIL Address': 'admin@henrymotors.co.za',
        'Customer Postcode': '0081',
        'Address': 'PRETORIA',
        'Credit Limit': '400000',
        'Outstanding Bal': '95287.470000000118'
    },
    {
        'Account Number': 'M10019',
        'Customer Name': 'HATTINGH MOTORS',
        'Telephone Number': '012 663 6477',
        'EMAIL Address': 'vera@hattinghmotors.co.za',
        'Customer Postcode': '0157',
        'Address': 'PRETORIA',
        'Credit Limit': '1000000',
        'Outstanding Bal': '221053.50999999969'
    },
    {
        'Account Number': 'M10058',
        'Customer Name': 'TRANSPORT MOTOR REPAIRS',
        'Telephone Number': '012 329 1410',
        'EMAIL Address': 'tmr1@vodamail.co.za',
        'Customer Postcode': '8084',
        'Address': 'PRETORIA',
        'Credit Limit': '300000',
        'Outstanding Bal': '44357.099999999984'
    },
    {
        'Account Number': 'SKR001',
        'Customer Name': 'Stock Adjustment Account - Branch 1',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Customer Postcode': '9999',
        'Address': '',
        'Credit Limit': '9999999',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': 'WKR001',
        'Customer Name': 'Works Order Account - Branch 1',
        'Telephone Number': '',
        'EMAIL Address': '',
        'Customer Postcode': '9999',
        'Address': '',
        'Credit Limit': '9999999',
        'Outstanding Bal': '0'
    },
    {
        'Account Number': ''
    }
];
let UploadService = function () {
    logger.info('Upload Service initiated');
};
/**
 * the main pdf service with a interval timer for executing
 * **/
UploadService.prototype.startServices = function () {
    uploadSuppliers();
    uploadWorkshops();
};

function uploadSuppliers () {
    async.forEachOf(suppliers, (supplier, index, cb) => {
        try {
            const data = {
                name: supplier['Supplier Name'] || 'supplier 1',
                telephone: supplier['Telephone Number'] || '27106007901',
                account: supplier['Account Code'] || null,
                email: supplier['EMAIL Address'] || null,
                Address: {
                    streetAddress: '39 Renaissance Dr, Crown City',
                    city: 'Johannesburg',
                    province: supplier['Supplier Address'] || 'gauteng',
                    postalCode: '2092'
                }
            };
            Supplier.findOne({
                where: { name: data.name },
            }).then((supplier_exist) => {
                if (supplier_exist || data.account === null) {
                    logger.info('supplier is' + supplier_exist === null);
                    cb();
                } else {
                    async.waterfall([
                        function createAddress (next) {
                            Address.create(data.Address).then((address) => {
                                next(null, address);
                            }).catch((err) => {
                                next(err);
                            });
                        },
                        function createSupplier (address, next) {
                            data['addressId'] = address.id;
                            data.Address = address;
                            Supplier.create(data).then((supplier_new) => {
                                next(null, supplier_new);
                            }).catch((err) => {
                                next(err);
                            });
                        }
                    ],
                    function done (err, supplier_new) {
                        logger.info(err,'supplier is ' + supplier_new === undefined);
                        cb();
                    });
                }
            });
        } catch (e) {
            cb();
        }
    });
}
function uploadWorkshops () {
    async.forEachOf(workshops, (workshop, index, cb) => {
        try {
            const data = {
                name: workshop['Customer Name'] || 'work shop 3',
                telephone: workshop['Telephone Number'] || '27106007903',
                account: workshop['Account Number'] || null,
                email: workshop['EMAIL Address'] || null,
                Address: {
                    streetAddress: '31 Renaissance Dr, Crown City',
                    city: workshop['Supplier Address'] || 'gauteng',
                    province: 'gauteng',
                    postalCode: workshop['Customer Postcode'] || '2092'
                }
            };
            WorkShop.findOne({
                where: { name: data.name },
            }).then((workshop_exist) => {
                if (workshop_exist || data.account === null) {
                    logger.info('workshop is ' + workshop_exist === null);
                    cb();
                } else {
                    async.waterfall([
                        function createAddress (next) {
                            Address.create(data.Address).then((address) => {
                                next(null, address);
                            }).catch((err) => {
                                next(err);
                            });
                        },
                        function createWorkShop (address, next) {
                            data['addressId'] = address.id;
                            data.Address = address;
                            WorkShop.create(data).then((workshop_new) => {
                                next(null, workshop_new);
                            }).catch((err) => {
                                next(err);
                            });
                        }
                    ],
                    function done (err, workshop_new) {
                        logger.info(err,'workshop is ' + workshop_new === undefined);
                        cb();
                    });
                }
            });
        } catch (e) {
            cb();
        }
    });
}

module.exports = new UploadService();
