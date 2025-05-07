const viewData = {
    id: 'HRConfirmation',
    label: 'HRConfirmation',
    path: '/services/web/codbex-sample-hyperion-employee-onboarding/forms/HRConfirmation/hr-confirmation-form.html',
    groupId: 'EmployeeOnboarding',
    order: 4,
    icon: '/services/web/resources/unicons/users-alt.svg'
};
if (typeof exports !== 'undefined') {
    exports.getPerspective = () => viewData;
}