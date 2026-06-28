export const TEXT = {
  GENERAL: {
    NAVIGATION: {
      BACK_TO_LIST: 'common.navigation.backToList',
      BACK: 'common.navigation.back',
    },
    BUTTONS: {
      SAVE: 'common.buttons.save',
      CANCEL: 'common.buttons.cancel',
      LOADING: 'common.buttons.loading',
    },
    PAGINATION: {
      SHOWING: 'common.pagination.showing',
    },
  },
  MENU: {
    SIDEBAR: {
      BUSINESS: {
        NAME: 'menu.sidebar.business.name',
      },
      FILES: 'menu.sidebar.files',
      PATIENTS: 'menu.sidebar.patients',
      DASHBOARD: 'menu.sidebar.dashboard',
      CUSTOMERS: 'menu.sidebar.customers',
      ABOUT: 'menu.sidebar.about',
      SETTINGS: 'menu.sidebar.settings',
    },
  },
  USERS: {
    LIST: {
      TITLE: 'users.list.title',
      SEARCH_PLACEHOLDER: 'users.list.search_placeholder',
      SECURITY_TITLE: 'users.list.security_title',
      SECURITY_DESC: 'users.list.security_description',
      ROLES: {
        ALL: 'users.list.roles.all',
        ADMIN: 'users.list.roles.admin',
        DOCTOR: 'users.list.roles.doctor',
        STAFF: 'users.list.roles.staff',
      },
    },
    CREATE: {
      LAYOUT_TITLE: 'users.create.layoutTitle',
      TITLE: 'users.create.title',
      DESCRIPTION: 'users.create.description',
      SUBMIT: 'users.create.form.submit',
      FORM: {
        FULL_NAME: 'users.create.form.fullName',
        FULL_NAME_PLACEHOLDER: 'users.create.form.fullNamePlaceholder',
        EMAIL: 'users.create.form.email',
        EMAIL_PLACEHOLDER: 'users.create.form.emailPlaceholder',
        PASSWORD: 'users.create.form.password',
        PASSWORD_PLACEHOLDER: 'users.create.form.passwordPlaceholder',
        ROLE: 'users.create.form.role',
        SPECIALTY: 'users.create.form.specialty',
        SPECIALTY_PLACEHOLDER: 'users.create.form.specialtyPlaceholder',
        SUBMIT: 'users.create.form.submit',
      },
      ROLES: {
        OWNER: 'users.create.roles.OWNER',
        ADMIN: 'users.create.roles.ADMIN',
        DOCTOR: 'users.create.roles.DOCTOR',
        STAFF: 'users.create.roles.STAFF',
      },
    },
  },
  DASHBOARD: {
    GREETING: 'dashboard.greeting',
    METRICS: {
      NEXT_APPOINTMENT: 'dashboard.metrics.nextAppointment',
      NO_APPOINTMENTS: 'dashboard.metrics.noAppointments',
      COMPLETED_THIS_WEEK: 'dashboard.metrics.completedThisWeek',
      COMPLETED_THIS_WEEK_SUB: 'dashboard.metrics.completedThisWeekSub',
      PENDING_CONFIRMATION: 'dashboard.metrics.pendingConfirmation',
      PENDING_CONFIRMATION_SUB: 'dashboard.metrics.pendingConfirmationSub',
    },
    APPOINTMENTS: {
      TITLE: 'dashboard.appointments.title',
      VIEW_ALL: 'dashboard.appointments.viewAll',
      EMPTY: 'dashboard.appointments.empty',
    },
    QUICK_ACTIONS: {
      TITLE: 'dashboard.quickActions.title',
      NEW_PATIENT: 'dashboard.quickActions.newPatient',
      NEW_PATIENT_DESC: 'dashboard.quickActions.newPatientDesc',
      NEW_APPOINTMENT: 'dashboard.quickActions.newAppointment',
      NEW_APPOINTMENT_DESC: 'dashboard.quickActions.newAppointmentDesc',
      DO_TEST: 'dashboard.quickActions.doTest',
      DO_TEST_DESC: 'dashboard.quickActions.doTestDesc',
      INVENTORY: 'dashboard.quickActions.inventory',
      INVENTORY_DESC: 'dashboard.quickActions.inventoryDesc',
    },
  },
  APPOINTMENTS: {
    LIST: {
      SEARCH_PLACEHOLDER: 'appointments.list.searchPlaceholder',
      NEW_BUTTON: 'appointments.list.newButton',
      COLUMNS: {
        PATIENT: 'appointments.list.tableColumns.patient',
        SPECIALTY: 'appointments.list.tableColumns.specialty',
        DATE_TIME: 'appointments.list.tableColumns.dateTime',
        STATUS: 'appointments.list.tableColumns.status',
      },
      BULK: {
        SELECTED: 'appointments.list.bulkActions.selected',
        CHANGE_STATUS: 'appointments.list.bulkActions.changeStatus',
        APPLY: 'appointments.list.bulkActions.apply',
      },
    },
    MANAGE: {
      BACK: 'appointments.manage.back',
      STATUS_ALERT: {
        TITLE: 'appointments.manage.statusAlert.title',
        SUBTITLE: 'appointments.manage.statusAlert.subtitle',
      },
      ACTIONS: {
        NO_ANSWER: 'appointments.manage.actions.noAnswer',
        CONFIRM: 'appointments.manage.actions.confirm',
      },
      CALL_HISTORY: {
        TITLE: 'appointments.manage.callHistory.title',
        NO_ANSWER_LABEL: 'appointments.manage.callHistory.noAnswerLabel',
      },
      FORM: {
        ADJUST_DATE: 'appointments.manage.form.adjustDate',
        ADJUST_TIME: 'appointments.manage.form.adjustTime',
        FOLLOW_UP_LOG: 'appointments.manage.form.followUpLog',
        FOLLOW_UP_LOG_PLACEHOLDER: 'appointments.manage.form.followUpLogPlaceholder',
      },
    },
  },
  PATIENTS: {
    LIST: {
      TITLE: 'patients.list.title',
      NEW_BUTTON: 'patients.list.newButton',
      SEARCH_PLACEHOLDER: 'patients.list.searchPlaceholder',
      COLUMNS: {
        PATIENT: 'patients.list.columns.patient',
        PHONE: 'patients.list.columns.phone',
        REGISTERED_AT: 'patients.list.columns.registeredAt',
      },
      ACTIONS: {
        VIEW_FILE: 'patients.list.actions.viewFile',
        EDIT: 'patients.list.actions.edit',
      },
    },
  },
  CONTROLS: {
    NEW: {
      FOLLOW_UP: {
        TITLE: 'controls.new.followUp.title',
        CONFIRM_BUTTON: 'controls.new.followUp.confirmButton',
        NOTES_PLACEHOLDER: 'controls.new.followUp.notesPlaceholder',
      },
      SPECIALITY: {
        LABEL: 'controls.new.speciality.label',
      },
      EXAMINATION: {
        LABEL_PREFIX: 'controls.new.examination.labelPrefix',
        ADD_AUDIOMETRY: 'controls.new.examination.addAudiometry',
        REMOVE_AUDIOMETRY: 'controls.new.examination.removeAudiometry',
        OTOSCOPY_RIGHT: 'controls.new.examination.otoscopyRight',
        OTOSCOPY_LEFT: 'controls.new.examination.otoscopyLeft',
      },
      DIAGNOSIS: {
        LABEL: 'controls.new.diagnosis.label',
        PLACEHOLDER: 'controls.new.diagnosis.placeholder',
      },
      SCHEDULING: {
        TITLE: 'controls.new.scheduling.title',
      },
      BUTTONS: {
        CANCEL: 'controls.new.buttons.cancel',
        SAVE: 'controls.new.buttons.save',
        SAVING: 'controls.new.buttons.saving',
      },
      HISTORY: {
        TITLE: 'controls.new.history.title',
      },
    },
  },
} as const;
