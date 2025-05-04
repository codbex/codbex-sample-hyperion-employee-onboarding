const viewData = {
    id: 'TaskCompletion',
    label: 'TaskCompletion',
    path: '/services/web/codbex-sample-hyperion-employee-onboarding/forms/TaskCompletion/task-completion-form.html',
    groupId: 'EmployeeOnboarding',
    order: 3,
    icon: '/services/web/resources/unicons/file-check.svg'
};
if (typeof exports !== 'undefined') {
    exports.getPerspective = () => viewData;
}