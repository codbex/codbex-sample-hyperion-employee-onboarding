const navigationData = {
    id: 'task-completion-navigation',
    label: "Task Completion",
    group: "employees",
    order: 1500,
    link: "/services/web/codbex-sample-hyperion-employee-onboarding/forms/TaskCompletion/task-completion-form.html"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }