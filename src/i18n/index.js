import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import commonVi from './locales/vi/common.json'
import clientHeaderVi from './locales/vi/client/header.json'
import clientFooterVi from './locales/vi/client/footer.json'
import clientSettingsVi from './locales/vi/client/settings.json'
import clientSidebarVi from './locales/vi/client/sidebar.json'
import clientHomeVi from './locales/vi/client/home.json'
import clientProductsVi from './locales/vi/client/products.json'
import clientFlashSaleVi from './locales/vi/client/flashSale.json'
import clientAboutVi from './locales/vi/client/about.json'
import clientBlogVi from './locales/vi/client/blog.json'
import clientContactVi from './locales/vi/client/contact.json'
import clientCartVi from './locales/vi/client/cart.json'
import clientCheckoutVi from './locales/vi/client/checkout.json'
import clientWishlistVi from './locales/vi/client/wishlist.json'
import clientProfileVi from './locales/vi/client/profile.json'
import clientVipVi from './locales/vi/client/vip.json'
import clientCouponsEn from './locales/en/client/coupons.json'
import clientComingSoonVi from './locales/vi/client/comingSoon.json'
import clientShoppingGuideVi from './locales/vi/client/shoppingGuide.json'
import clientPrivacyVi from './locales/vi/client/privacy.json'
import clientReturnPolicyVi from './locales/vi/client/returnPolicy.json'
import clientTermsVi from './locales/vi/client/terms.json'
import clientFaqVi from './locales/vi/client/faq.json'
import clientChatVi from './locales/vi/client/chat.json'
import clientAuthVi from './locales/vi/client/auth.json'
import adminAuthVi from './locales/vi/admin/auth.json'
import adminLayoutVi from './locales/vi/admin/layout.json'
import adminAccountsVi from './locales/vi/admin/accounts.json'
import adminBankInfoVi from './locales/vi/admin/bankInfo.json'
import adminChatVi from './locales/vi/admin/chat.json'
import adminChatbotConfigVi from './locales/vi/admin/chatbotConfig.json'
import adminChatbotRuntimeVi from './locales/vi/admin/chatbotRuntime.json'
import adminChatbotRulesVi from './locales/vi/admin/chatbotRules.json'
import adminChatbotToolsVi from './locales/vi/admin/chatbotTools.json'
import adminChatbotToolLogsVi from './locales/vi/admin/chatbotToolLogs.json'
import adminDashboardVi from './locales/vi/admin/dashboard.json'
import adminProfileVi from './locales/vi/admin/profile.json'
import adminSettingsVi from './locales/vi/admin/settings.json'
import adminProductsVi from './locales/vi/admin/products.json'
import adminProductCategoriesVi from './locales/vi/admin/productCategories.json'
import adminPromoCodesVi from './locales/vi/admin/promoCodes.json'
import adminPurchaseReceiptsVi from './locales/vi/admin/purchaseReceipts.json'
import adminFlashSalesVi from './locales/vi/admin/flashSales.json'
import adminOrdersVi from './locales/vi/admin/orders.json'
import adminNotificationsVi from './locales/vi/admin/notifications.json'
import adminOrderDetailVi from './locales/vi/admin/orderDetail.json'
import adminReviewsVi from './locales/vi/admin/reviews.json'
import adminBannersVi from './locales/vi/admin/banners.json'
import adminAboutVi from './locales/vi/admin/about.json'
import adminBlogVi from './locales/vi/admin/blog.json'
import adminTermsVi from './locales/vi/admin/terms.json'
import adminCooperationContactVi from './locales/vi/admin/cooperationContact.json'
import adminHomeWhyChooseUsVi from './locales/vi/admin/homeWhyChooseUs.json'
import adminWidgetsVi from './locales/vi/admin/widgets.json'
import adminContactPageVi from './locales/vi/admin/contactPage.json'
import adminPrivacyPolicyVi from './locales/vi/admin/privacyPolicy.json'
import adminReturnPolicyVi from './locales/vi/admin/returnPolicy.json'
import adminFaqVi from './locales/vi/admin/faq.json'
import adminFooterVi from './locales/vi/admin/footer.json'
import adminGameAccountVi from './locales/vi/admin/gameAccount.json'
import adminComingSoonPagesVi from './locales/vi/admin/comingSoonPages.json'
import adminGameNewsVi from './locales/vi/admin/gameNews.json'
import adminVipVi from './locales/vi/admin/vip.json'
import adminPermissionGroupsVi from './locales/vi/admin/permissionGroups.json'
import adminPermissionsVi from './locales/vi/admin/permissions.json'
import adminRolePermissionVi from './locales/vi/admin/rolePermission.json'
import adminRolesVi from './locales/vi/admin/roles.json'

import commonEn from './locales/en/common.json'
import clientSettingsEn from './locales/en/client/settings.json'
import clientHeaderEn from './locales/en/client/header.json'
import clientFooterEn from './locales/en/client/footer.json'
import clientSidebarEn from './locales/en/client/sidebar.json'
import clientHomeEn from './locales/en/client/home.json'
import clientProductsEn from './locales/en/client/products.json'
import clientFlashSaleEn from './locales/en/client/flashSale.json'
import clientAboutEn from './locales/en/client/about.json'
import clientBlogEn from './locales/en/client/blog.json'
import clientContactEn from './locales/en/client/contact.json'
import clientCartEn from './locales/en/client/cart.json'
import clientCheckoutEn from './locales/en/client/checkout.json'
import clientWishlistEn from './locales/en/client/wishlist.json'
import clientProfileEn from './locales/en/client/profile.json'
import clientVipEn from './locales/en/client/vip.json'
import clientCouponsVi from './locales/vi/client/coupons.json'
import clientComingSoonEn from './locales/en/client/comingSoon.json'
import clientShoppingGuideEn from './locales/en/client/shoppingGuide.json'
import clientPrivacyEn from './locales/en/client/privacy.json'
import clientReturnPolicyEn from './locales/en/client/returnPolicy.json'
import clientTermsEn from './locales/en/client/terms.json'
import clientFaqEn from './locales/en/client/faq.json'
import clientChatEn from './locales/en/client/chat.json'
import clientAuthEn from './locales/en/client/auth.json'
import adminAuthEn from './locales/en/admin/auth.json'
import adminLayoutEn from './locales/en/admin/layout.json'
import adminAccountsEn from './locales/en/admin/accounts.json'
import adminBankInfoEn from './locales/en/admin/bankInfo.json'
import adminChatEn from './locales/en/admin/chat.json'
import adminChatbotConfigEn from './locales/en/admin/chatbotConfig.json'
import adminChatbotRuntimeEn from './locales/en/admin/chatbotRuntime.json'
import adminChatbotRulesEn from './locales/en/admin/chatbotRules.json'
import adminChatbotToolsEn from './locales/en/admin/chatbotTools.json'
import adminChatbotToolLogsEn from './locales/en/admin/chatbotToolLogs.json'
import adminDashboardEn from './locales/en/admin/dashboard.json'
import adminProfileEn from './locales/en/admin/profile.json'
import adminSettingsEn from './locales/en/admin/settings.json'
import adminProductsEn from './locales/en/admin/products.json'
import adminProductCategoriesEn from './locales/en/admin/productCategories.json'
import adminPromoCodesEn from './locales/en/admin/promoCodes.json'
import adminPurchaseReceiptsEn from './locales/en/admin/purchaseReceipts.json'
import adminFlashSalesEn from './locales/en/admin/flashSales.json'
import adminOrdersEn from './locales/en/admin/orders.json'
import adminNotificationsEn from './locales/en/admin/notifications.json'
import adminOrderDetailEn from './locales/en/admin/orderDetail.json'
import adminReviewsEn from './locales/en/admin/reviews.json'
import adminBannersEn from './locales/en/admin/banners.json'
import adminAboutEn from './locales/en/admin/about.json'
import adminBlogEn from './locales/en/admin/blog.json'
import adminTermsEn from './locales/en/admin/terms.json'
import adminCooperationContactEn from './locales/en/admin/cooperationContact.json'
import adminHomeWhyChooseUsEn from './locales/en/admin/homeWhyChooseUs.json'
import adminWidgetsEn from './locales/en/admin/widgets.json'
import adminContactPageEn from './locales/en/admin/contactPage.json'
import adminPrivacyPolicyEn from './locales/en/admin/privacyPolicy.json'
import adminReturnPolicyEn from './locales/en/admin/returnPolicy.json'
import adminFaqEn from './locales/en/admin/faq.json'
import adminFooterEn from './locales/en/admin/footer.json'
import adminGameAccountEn from './locales/en/admin/gameAccount.json'
import adminComingSoonPagesEn from './locales/en/admin/comingSoonPages.json'
import adminGameNewsEn from './locales/en/admin/gameNews.json'
import adminVipEn from './locales/en/admin/vip.json'
import adminPermissionGroupsEn from './locales/en/admin/permissionGroups.json'
import adminPermissionsEn from './locales/en/admin/permissions.json'
import adminRolePermissionEn from './locales/en/admin/rolePermission.json'
import adminRolesEn from './locales/en/admin/roles.json'

export const LANGUAGE_STORAGE_KEY = 'language'

function getInitialLanguage() {
  try {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (storedLanguage === 'vi' || storedLanguage === 'en') {
      return storedLanguage
    }
  } catch {
    // Ignore storage errors
  }

  return 'vi'
}

i18n.use(initReactI18next).init({
  resources: {
    vi: {
      common: commonVi,
      clientHeader: clientHeaderVi,
      clientFooter: clientFooterVi,
      clientSettings: clientSettingsVi,
      clientSidebar: clientSidebarVi,
      clientHome: clientHomeVi,
      clientProducts: clientProductsVi,
      clientFlashSale: clientFlashSaleVi,
      clientAbout: clientAboutVi,
      clientBlog: clientBlogVi,
      clientContact: clientContactVi,
      clientCart: clientCartVi,
      clientCheckout: clientCheckoutVi,
      clientWishlist: clientWishlistVi,
      clientProfile: clientProfileVi,
      clientVip: clientVipVi,
      clientCoupons: clientCouponsVi,
      clientComingSoon: clientComingSoonVi,
      clientShoppingGuide: clientShoppingGuideVi,
      clientPrivacy: clientPrivacyVi,
      clientReturnPolicy: clientReturnPolicyVi,
      clientTerms: clientTermsVi,
      clientFaq: clientFaqVi,
      clientChat: clientChatVi,
      clientAuth: clientAuthVi,
      adminAuth: adminAuthVi,
      adminLayout: adminLayoutVi,
      adminAccounts: adminAccountsVi,
      adminBankInfo: adminBankInfoVi,
      adminChat: adminChatVi,
      adminChatbotConfig: adminChatbotConfigVi,
      adminChatbotRuntime: adminChatbotRuntimeVi,
      adminChatbotRules: adminChatbotRulesVi,
      adminChatbotTools: adminChatbotToolsVi,
      adminChatbotToolLogs: adminChatbotToolLogsVi,
      adminDashboard: adminDashboardVi,
      adminProfile: adminProfileVi,
      adminSettings: adminSettingsVi,
      adminProducts: adminProductsVi,
      adminProductCategories: adminProductCategoriesVi,
      adminPromoCodes: adminPromoCodesVi,
      adminPurchaseReceipts: adminPurchaseReceiptsVi,
      adminFlashSales: adminFlashSalesVi,
      adminOrders: adminOrdersVi,
      adminNotifications: adminNotificationsVi,
      adminOrderDetail: adminOrderDetailVi,
      adminReviews: adminReviewsVi,
      adminBanners: adminBannersVi,
      adminAbout: adminAboutVi,
      adminBlog: adminBlogVi,
      adminTerms: adminTermsVi,
      adminCooperationContact: adminCooperationContactVi,
      adminHomeWhyChooseUs: adminHomeWhyChooseUsVi,
      adminWidgets: adminWidgetsVi,
      adminContactPage: adminContactPageVi,
      adminPrivacyPolicy: adminPrivacyPolicyVi,
      adminReturnPolicy: adminReturnPolicyVi,
      adminFaq: adminFaqVi,
      adminFooter: adminFooterVi,
      adminGameAccount: adminGameAccountVi,
      adminComingSoonPages: adminComingSoonPagesVi,
      adminGameNews: adminGameNewsVi,
      adminVip: adminVipVi,
      adminPermissionGroups: adminPermissionGroupsVi,
      adminPermissions: adminPermissionsVi,
      adminRolePermission: adminRolePermissionVi,
      adminRoles: adminRolesVi
    },
    en: {
      common: commonEn,
      clientHeader: clientHeaderEn,
      clientFooter: clientFooterEn,
      clientSettings: clientSettingsEn,
      clientSidebar: clientSidebarEn,
      clientHome: clientHomeEn,
      clientProducts: clientProductsEn,
      clientFlashSale: clientFlashSaleEn,
      clientAbout: clientAboutEn,
      clientBlog: clientBlogEn,
      clientContact: clientContactEn,
      clientCart: clientCartEn,
      clientCheckout: clientCheckoutEn,
      clientWishlist: clientWishlistEn,
      clientProfile: clientProfileEn,
      clientVip: clientVipEn,
      clientCoupons: clientCouponsEn,
      clientComingSoon: clientComingSoonEn,
      clientShoppingGuide: clientShoppingGuideEn,
      clientPrivacy: clientPrivacyEn,
      clientReturnPolicy: clientReturnPolicyEn,
      clientTerms: clientTermsEn,
      clientFaq: clientFaqEn,
      clientChat: clientChatEn,
      clientAuth: clientAuthEn,
      adminAuth: adminAuthEn,
      adminLayout: adminLayoutEn,
      adminAccounts: adminAccountsEn,
      adminBankInfo: adminBankInfoEn,
      adminChat: adminChatEn,
      adminChatbotConfig: adminChatbotConfigEn,
      adminChatbotRuntime: adminChatbotRuntimeEn,
      adminChatbotRules: adminChatbotRulesEn,
      adminChatbotTools: adminChatbotToolsEn,
      adminChatbotToolLogs: adminChatbotToolLogsEn,
      adminDashboard: adminDashboardEn,
      adminProfile: adminProfileEn,
      adminSettings: adminSettingsEn,
      adminProducts: adminProductsEn,
      adminProductCategories: adminProductCategoriesEn,
      adminPromoCodes: adminPromoCodesEn,
      adminPurchaseReceipts: adminPurchaseReceiptsEn,
      adminFlashSales: adminFlashSalesEn,
      adminOrders: adminOrdersEn,
      adminNotifications: adminNotificationsEn,
      adminOrderDetail: adminOrderDetailEn,
      adminReviews: adminReviewsEn,
      adminBanners: adminBannersEn,
      adminAbout: adminAboutEn,
      adminBlog: adminBlogEn,
      adminTerms: adminTermsEn,
      adminCooperationContact: adminCooperationContactEn,
      adminHomeWhyChooseUs: adminHomeWhyChooseUsEn,
      adminWidgets: adminWidgetsEn,
      adminContactPage: adminContactPageEn,
      adminPrivacyPolicy: adminPrivacyPolicyEn,
      adminReturnPolicy: adminReturnPolicyEn,
      adminFaq: adminFaqEn,
      adminFooter: adminFooterEn,
      adminGameAccount: adminGameAccountEn,
      adminComingSoonPages: adminComingSoonPagesEn,
      adminGameNews: adminGameNewsEn,
      adminVip: adminVipEn,
      adminPermissionGroups: adminPermissionGroupsEn,
      adminPermissions: adminPermissionsEn,
      adminRolePermission: adminRolePermissionEn,
      adminRoles: adminRolesEn
    }
  },
  lng: getInitialLanguage(),
  fallbackLng: 'vi',
  ns: [
    'common',
    'clientHeader',
    'clientFooter',
    'clientSettings',
    'clientSidebar',
    'clientHome',
    'clientProducts',
    'clientFlashSale',
    'clientAbout',
    'clientBlog',
    'clientContact',
    'clientCart',
    'clientCheckout',
    'clientProfile',
    'clientVip',
    'clientCoupons',
    'clientComingSoon',
    'clientShoppingGuide',
    'clientPrivacy',
    'clientReturnPolicy',
    'clientTerms',
    'clientFaq',
    'clientChat',
    'clientAuth',
    'adminAuth',
    'adminLayout',
    'adminAccounts',
    'adminBankInfo',
    'adminChat',
    'adminChatbotConfig',
    'adminChatbotRuntime',
    'adminChatbotRules',
    'adminChatbotTools',
    'adminChatbotToolLogs',
    'adminDashboard',
    'adminProfile',
    'adminSettings',
    'adminProducts',
    'adminProductCategories',
    'adminPromoCodes',
    'adminPurchaseReceipts',
    'adminFlashSales',
    'adminOrders',
    'adminNotifications',
    'adminOrderDetail',
    'adminReviews',
    'adminBanners',
    'adminAbout',
    'adminBlog',
    'adminTerms',
    'adminCooperationContact',
    'adminHomeWhyChooseUs',
    'adminWidgets',
    'adminContactPage',
    'adminPrivacyPolicy',
    'adminReturnPolicy',
    'adminFaq',
    'adminFooter',
    'adminGameAccount',
    'adminComingSoonPages',
    'adminGameNews',
    'adminVip',
    'adminPermissionGroups',
    'adminPermissions',
    'adminRolePermission',
    'adminRoles'
  ],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
