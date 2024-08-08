import React from "react";
import { Route, Routes } from "react-router-dom";
import Organization from "../pages/organization/Organization";
import Location from "../pages/location/Location";
import Items from "../pages/items/Items";
import Locator from "../pages/locator/Locator";
import User from "../pages/user/User";
import DepartmentPage from "../pages/department/Department";
import Employee from "../pages/employee/Employee";
import Tax from "../pages/tax/Tax";
import Transaction from "../pages/transaction/Transaction";
import UOM from "../pages/UOM/UOM";
import Currency from "../pages/currency/Currency";
import Vendor from "../pages/vendor/Vendor";
import QuickCode from "../pages/quickCode/QuickCode";
import GoodsReceiveNoteForm from "../pages/txnform/grn/GoodsReceiveNoteForm";
import DemandNoteForm from "../pages/txnform/demandnote/DemandNoteForm";
import IrdDemand from "../pages/txnform/irdDemand/IrdDemand";
import RetunNote from "../pages/txnform/returnnote/ReturnNote";
import InsepctionReport from "../pages/txnform/insepctionReport/InsepctionReport";
import InspectionNote from "../pages/txnform/inspectionNote/InspectionNote";
import IssueNote from "../pages/txnform/issuenote/IssueNote";
import OutwardGatePass from "../pages/txnform/outwardgatepass/OutwardGatePass";
import InwardGatePass from "../pages/txnform/inwardgatepass/InwardGatePass";
import AcceptanceNote from "../pages/txnform/acceptancenote/AcceptanceNote";
import RejectionNote from "../pages/txnform/rejectionnote/RejectionNote";
import Itemdemandsearch from "../components/Itemdemandsearch";
import OHQ from "../pages/ohq/ohq";
import TransactionSummary from "../pages/transactionSummary/TransactionSummary";
import TransactionDetail from "../pages/transactionSummary/TransactionDetail";
import StockLedger from "../pages/stockLedger/StockLedger";
import HqOhq from "../pages/hqRoutes/HqOhq";
import HqTxnSummary from "../pages/hqRoutes/HqTxnSummary";
import HqStockLedger from "../pages/hqRoutes/HqStockLedger";
import ChangePasswordForm from "../auth/ChangePasswordForm";
import SignIn from "../auth/Login";
import Layout from "../components/Layout";
import PrivateRoutes from "./PrivateRoutes";
import { useSelector } from "react-redux";
import DashboardWrapper from "../pages/dashboard/DashboardWrapper";

const RoutesComponent = () => {
  const userRole = useSelector((state) => state.auth.userRole);

  const headquarterRoutes = (
    <>
      <Route path="/hqOhq" element={<HqOhq />} />
      <Route path="/hqTxnSummary" element={<HqTxnSummary />} />
      <Route path="/hqStockLedger" element={<HqStockLedger />} />
      <Route path="/hqTxnSummary/:trnno" element={<TransactionDetail />} />
    </>
  );

  const superAdminRoutes = (
    <>
      <Route path="/sub-organization" element={<Organization />} />
      <Route path="/location" element={<Location />} />
      <Route path="/items" element={<Items />} />
      <Route path="/ohq" element={<OHQ />} />
      <Route path="/trnsummary" element={<TransactionSummary />} />
      <Route path="/trnsummary/:trnno" element={<TransactionDetail />} />
      <Route path="/stockLedger" element={<StockLedger />} />
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
      <Route path="/trans/inspectionNote" element={<InspectionNote />} />
      <Route path="/trans/acceptance" element={<AcceptanceNote />} />
      <Route path="/trans/rejection" element={<RejectionNote />} />
      {<Route path="/itemsearch" element={<Itemdemandsearch />} />}
    </>
  );

  const adminRoutes = (
    <>
      <Route path="/items" element={<Items />} />
      <Route path="/ohq" element={<OHQ />} />
      <Route path="/trnsummary" element={<TransactionSummary />} />
      <Route path="/trnsummary/:trnno" element={<TransactionDetail />} />
      <Route path="/stockLedger" element={<StockLedger />} />
      <Route path="/department" element={<DepartmentPage />} />
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
      <Route path="/trans/inspectionNote" element={<InspectionNote />} />
      <Route path="/trans/acceptance" element={<AcceptanceNote />} />
      <Route path="/trans/rejection" element={<RejectionNote />} />
      {<Route path="/itemsearch" element={<Itemdemandsearch />} />}
    </>
  );

  const inventoryManagerRoutes = (
    <>
      <Route path="/sub-organization" element={<Organization />} />
      <Route path="/items" element={<Items />} />
      <Route path="/ohq" element={<OHQ />} />
      <Route path="/trnsummary" element={<TransactionSummary />} />
      <Route path="/trnsummary/:trnno" element={<TransactionDetail />} />
      <Route path="/locator" element={<Locator />} />
      <Route path="/uom" element={<UOM />} />
      <Route path="/Vendor" element={<Vendor />} />
      <Route path="/trans/grn" element={<GoodsReceiveNoteForm />} />
      <Route path="/trans/demand" element={<DemandNoteForm />} />
      <Route path="/trans/ird-demand" element={<IrdDemand />} />
      <Route path="/trans/issue" element={<IssueNote />} />
      <Route path="/trans/outward" element={<OutwardGatePass />} />
      <Route path="/trans/inward" element={<InwardGatePass />} />
      <Route path="/trans/return" element={<RetunNote />} />
      <Route path="/trans/inspection" element={<InsepctionReport />} />
      <Route path="/trans/inspectionNote" element={<InspectionNote />} />
      <Route path="/trans/acceptance" element={<AcceptanceNote />} />
      <Route path="/trans/rejection" element={<RejectionNote />} />
      {<Route path="/itemsearch" element={<Itemdemandsearch />} />}
    </>
  );

  const qualityManagerRoutes = (
    <>
      <Route path="/ohq" element={<OHQ />} />
      <Route path="/trans/grn" element={<GoodsReceiveNoteForm />} />
      <Route path="/trans/demand" element={<DemandNoteForm />} />
      <Route path="/trans/ird-demand" element={<IrdDemand />} />
      <Route path="/trans/issue" element={<IssueNote />} />
      <Route path="/trans/outward" element={<OutwardGatePass />} />
      <Route path="/trans/inward" element={<InwardGatePass />} />
      <Route path="/trans/return" element={<RetunNote />} />
      <Route path="/trans/inspection" element={<InsepctionReport />} />
      <Route path="/trans/inspectionNote" element={<InspectionNote />} />
      <Route path="/trans/acceptance" element={<AcceptanceNote />} />
      <Route path="/trans/rejection" element={<RejectionNote />} />
    </>
  );

  const itemAdminRoutes = (
    <>
      <Route path="/items" element={<Items />} />
    </>
  );

  const vendorAdminRoutes = (
    <>
      <Route path="/Vendor" element={<Vendor />} />
      <Route path="/trans/inward" element={<InwardGatePass />} />
    </>
  );

  const generateRoutes = (userRole) => {
    switch (userRole) {
      case "SuperAdmin":
        return superAdminRoutes;
      case "ssadmin":
        return headquarterRoutes;
      case "admin":
        return adminRoutes;
      case "InventoryManager":
        return inventoryManagerRoutes;
      case "QualityManager":
        return qualityManagerRoutes;
      case "ItemAdmin":
        return itemAdminRoutes;
      case "VendorAdmin":
        return vendorAdminRoutes;
      default:
        return adminRoutes;
    }
  };

  return (
    <Routes>
      <Route path="/changePassword" element={<ChangePasswordForm />} />
      <Route path="/login" element={<SignIn />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardWrapper />} />
          {generateRoutes(userRole)}
        </Route>
      </Route>
    </Routes>
  );
};

export default RoutesComponent;
