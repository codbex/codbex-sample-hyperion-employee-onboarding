const viewData = {
    id: 'employee-onboarding-sample',
    label: 'New Hire',
    region: 'center',
    lazyLoad: false,
    autoFocusTab: true,
    path: '/services/web/codbex-sample-hyperion-employee-onboarding/forms/NewHireDetails/new-hire-details-form.html'
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}