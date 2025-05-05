const viewData = {
    id: 'ManagerReview',
    label: 'ManagerReview',
    path: '/services/web/codbex-sample-hyperion-employee-onboarding/forms/ManagerReview/manager-review-form.html',
    groupId: 'EmployeeOnboarding',
    order: 2,
    icon: '/services/web/resources/unicons/user-check.svg'
};
if (typeof exports !== 'undefined') {
    exports.getPerspective = () => viewData;
}