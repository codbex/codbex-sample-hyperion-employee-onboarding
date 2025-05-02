const perspectiveData = {
    id: 'NewHire',
    label: 'NewHire',
    path: '/services/web/codbex-sample-hyperion-employee-onboarding/forms/NewHireDetails/new-hire-details-form.html',
    groupId: 'Employees',
    order: 2,
    icon: '/services/web/resources/unicons/users-alt.svg'
};
if (typeof exports !== 'undefined') {
    exports.getPerspective = () => perspectiveData;
}