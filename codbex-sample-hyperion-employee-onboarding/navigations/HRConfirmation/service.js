const navigationData = {
    id: 'hr-confirmation-navigation',
    label: "HR Confirmation",
    group: "employees",
    order: 1400,
    link: "/services/web/codbex-sample-hyperion-employee-onboarding/forms/HRConfirmation/hr-confirmation-form.html"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }