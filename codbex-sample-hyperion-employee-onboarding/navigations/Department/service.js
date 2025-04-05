const navigationData = {
    id: 'department-navigation',
    label: "Department",
    group: "company",
    order: 700,
    link: "/services/web/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/ui/Department/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
