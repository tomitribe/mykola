# angular-tomitribe-select

Directives to use in ui-select.

    * tribe-activate-hover
        This directive set the option active, when the mouseenter event is fired.

     Ex:
        ui-select-choices(repeat="role in availableRoles")
            div(tribe-activate-hover="role")
              span {{role.name}}