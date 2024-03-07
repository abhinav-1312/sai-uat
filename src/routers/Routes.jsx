// routes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Organization from '../pages/organization/Organization';
import Location from '../pages/location/Location';
import Items from '../pages/items/Items';
import Locator from '../pages/locator/Locator';
import User from '../pages/user/User';
import DepartmentPage from '../pages/department/Department';
import Employee from '../pages/employee/Employee';
import Tax from '../pages/tax/Tax';
import Transaction from '../pages/transaction/Transaction';
import UOM from '../pages/UOM/UOM';
import Currency from '../pages/currency/Currency';
import Vendor from '../pages/vendor/Vendor';
import QuickCode from '../pages/quickCode/QuickCode';
import GoodsReceiveNoteForm from '../pages/txnform/grn/GoodsReceiveNoteForm';
import DemandNoteForm from '../pages/txnform/demandnote/DemandNoteForm';
import IrdDemand from '../pages/txnform/irdDemand/IrdDemand';
import RetunNote from '../pages/txnform/returnnote/ReturnNote';
import InsepctionReport from '../pages/txnform/insepctionReport/InsepctionReport';
import IssueNote from '../pages/txnform/issuenote/IssueNote';
import OutwardGatePass from '../pages/txnform/outwardgatepass/OutwardGatePass';
import InwardGatePass from '../pages/txnform/inwardgatepass/InwardGatePass';
import AcceptanceNote from '../pages/txnform/acceptancenote/AcceptanceNote';
import RejectionNote from '../pages/txnform/rejectionnote/RejectionNote';
import Itemdemandsearch from '../components/Itemdemandsearch';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/sub-organization" element={<Organization />} />
      <Route path="/location" element={<Location />} />
      <Route path="/items" element={<Items />} />
      <Route path="/locator" element={<Locator />} />
      <Route path="/department" element={<DepartmentPage />} />
      <Route path="/user" element={<User />} />
      <Route path="/employee" element={<Employee />} />
      <Route path="/tax" element={<Tax />} />
      <Route path="/transaction" element={<Transaction />} />
      <Route path="/uom" element={<UOM />} />
      <Route path="/currency" element={<Currency />} />
      <Route path="/Vendor" element={<Vendor />} />
      <Route path="/quickcode" element={<QuickCode />} />
      <Route path="/trans/grn" element={<GoodsReceiveNoteForm />} />
      <Route path="/trans/demand" element={<DemandNoteForm />} />
      <Route path="/trans/ird-demand" element={<IrdDemand />} />
      <Route path="/trans/issue" element={<IssueNote />} />
      <Route path="/trans/outward" element={<OutwardGatePass />} />
      <Route path="/trans/inward" element={<InwardGatePass />} />
      <Route path="/trans/return" element={<RetunNote />} />
      <Route path="/trans/inspection" element={<InsepctionReport />} />
      <Route path="/trans/acceptance" element={<AcceptanceNote />} />
      <Route path="/trans/rejection" element={<RejectionNote />} />
     { <Route path="/itemsearch" element={<Itemdemandsearch />} />
  }
     
    </Routes>
  );
};

export default RoutesComponent;
