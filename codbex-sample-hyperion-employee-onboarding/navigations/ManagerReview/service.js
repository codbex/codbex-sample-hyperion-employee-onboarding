const navigationData = {
    id: 'manager-review-navigation',
    label: "Manager Review",
    group: "employees",
    order: 1300,
    link: "/services/web/codbex-sample-hyperion-employee-onboarding/forms/ManagerReview/manager-review-form.html"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }