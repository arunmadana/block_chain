import { queries } from '@testing-library/react';
import api from '../../services';

//fetch transactions detaisl

//get customer transactions

export const getBusinessTransactions = (
  type,
  // txnWalletType,
  data,
  { pageSize = 10, currentPage = 1 },
  id,
  { column = '', order = '' },
  txnStatus,
  transactionType,
  transactionSubType
) => {
  const standardParams = {
    isMerchantTokenTransactions: true,
    userId: id,
    // txnWalletType: txnWalletType,
    walletCategory: type,
    pageSize: pageSize,
    txnStatus: txnStatus,
    transactionType: transactionType,
    transactionSubType: transactionSubType,
    pageNo: currentPage - 1,
    sortColumnName: column !== '' ? column : undefined,
    sortDirection: order !== '' ? order : undefined
  };
  const finalParams = Object.assign(standardParams, data);

  return api.post('/transactions/me/pending-posted-txns', finalParams);
};

//Customer Wallets

export const getWallets = () => api.get('/profile/me/wallets');

//Admin wallets

export const getWalletsAdmin = (id) => api.get(`/admin/${id}/wallets`);

export const getAllGboxTransactionsTable = (params) => {
  const queryParams = params;
  return api.post('/transactions/admin', queryParams);
};

// get all Gbox portal transactions
export const getAllGboxTransactions = (params) => {
  const queryParams = { params };

  return api.get('/transactions/me', queryParams);
};

//get corda fee
export const getCordaFee = (data) => api.post('/corda/fee', data);

//Send Tokens
/**
 *
 * @param {{
 * description: string,
 * recipientWalletId: string,
 * tokens: number
 * }} data
 * @returns
 */
export const sendGbtToken = (data) => api.post('/node/sendTokens', data);

/**
 * Currency type: 1 for ETH, 2 for BTC
 *
 * @param {{
 *  currencyType: number,
 *  description: string,
 *  email: string
 * }} data
 * @returns
 */
export const shareWalletInfo = (data) => {
  return api.post('/wallets/transactions/share-wallet-info', data);
};

// Validate 2stepOTP
export const otpValidade = (otp, actionType) => {
  const payload = {
    otp: otp,
    actionType: actionType
  };

  return api.post('/admin/step-up/authy', payload);
};

export const getTransactionLimit = (data) =>
  api.post('/transactions/me/limit', data);

//Account limits
export const getAccountLimits = (userType) =>
  api.get(`/accountlimits/me/${userType}`);

export const buyTokenTransaction = (data) => api.post('/node/buyTokens', data);

export const withdrawTokenTransaction = (data) =>
  api.post(`/node/withdrawTokens`, data);

export const txnFilterActivitySummary = (userId, data) => {
  return api.post(
    `/transactions/admin/customer/${userId}/txn-activity-summary`,
    {
      fromDate: data.fromDate,
      toDate: data.toDate
    }
  );
};

//Feature Controls
export const HandleFeatureContols = (data) =>
  api.get(`/feature/controls/${data}`);

//Transactions logs
export const transactionActivityLog = (id, userType) => {
  return api.post(
    `/logs/transaction`,
    {},
    { params: { txnId: id, userType: userType } }
  );
};

// Get Transaction cancel details
export const transactionCancelWithdraw = (dataId) => {
  return api.post(`/node/cancel-withdraw/${dataId}`);
};

// Batch Payout
export const commissionPayout = (batchId) => {
  return api.post(`/transactions/comission-payout/`, batchId);
};

//Create Dispute
export const createDispute = (data) => api.put('/dispute/create', data);

// Used to fetch all posted transactions
export const getTransactions = (params) => {
  const queryParams = params;
  return api.post('/transactions/me/pending-posted-txns', queryParams);
};
// Used to fetch all Business posted transactions

export const getApiBusinessTransactions = (requestBody) => {
  return api.post('/transactions/me/pending-posted-txns', requestBody);
};

// get Transaction Cancel Buy token Bank
export const transactionCancelBuyTokens = (dataId) => {
  return api.post(`/node/cancel-buytoken/${dataId}`);
};
