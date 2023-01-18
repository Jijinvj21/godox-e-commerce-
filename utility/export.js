

const ordermodel = require("../models/ordermodel");
const excelJS = require('exceljs');


//exportorder
const exportorder = async (req,res)=>{
    try{
  const workbook = new excelJS.Workbook();
  const  worksheet = workbook.addWorksheet("Sales Roport")
  worksheet.columns=[
    {header:"s no.", key:"s_no"},
    {header:"Date", key:"data"},
    {header:"User", key:"user"},
    {header:"Payment", key:"payment"},
    {header:"Status", key:"status"},
    {header:"Items", key:"item"},
    {header:"total", key:"total"},
  ];
  let counter =1;
  let totalof = 0;
  const saledata = await ordermodel.find();
  saledata.forEach((sale)=>{
    const date = sale.date;
    const isoString = date.toISOString();
    const newDate = isoString.split('T')[0];
    sale.data=newDate
  sale.s_no = counter;
  sale.user=sale.addresses[0].name
  sale.item=sale.product.length
  let myValue = sale.total;
let newValue = isNaN(myValue) ? 0 : myValue;
console.log(newValue);
 let tot= 1*newValue
  totalof += tot
  worksheet.addRow(sale);
  counter++;
  });
  worksheet.addRow({ data: 'Total', total: totalof});
  
  worksheet.getRow(1).eachCell((cell)=>{
    cell.font={bold:true};
  });
  
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
  );
  
  res.setHeader('Content-Disposition',`attachment; filename=sales_Report.xlsx`);
  
  return workbook.xlsx.write(res).then(()=>{
    res.status(200);
  });
  
    }
    catch(error){
  console.log(error.message)
    }
  
  }
  
  
 
  module.exports = {
    exportorder,
  }  
