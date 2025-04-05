const navigationData = {
    id: 'employee-onboarding-sample-navigation',
    label: "New Hire",
    group: "employees",
    order: 1200,
    link: "/services/web/codbex-sample-hyperion-employee-onboarding/forms/NewHireDetails/new-hire-details-form.html"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }