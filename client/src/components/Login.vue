<template>
  <div class="center">
    <vs-button
      @click="active = !active"
      circle
      icon
      floating
      color="success"
      :aria-label="$t('signIn')"
    >
      <i class="bx bx-log-in-circle"></i>
    </vs-button>
    <vs-dialog :loading="loading" v-model="active">
      <template #header>
        <h4
          v-if="mode === 'forgot'"
          class="not-margin"
          v-html="$t('typeEmail')"
        ></h4>
        <h4
          v-else-if="mode === 'reset'"
          class="not-margin"
          v-html="$t('typeNewPassword')"
        ></h4>
        <h4 v-else class="not-margin" v-html="$t('welcome')"></h4>
      </template>

      <div class="con-form">
        <vs-input
          v-if="mode !== 'reset'"
          v-model="data.email"
          :placeholder="$t('email')"
          @blur="validateField('email')"
        >
          <template #icon> @ </template>
          <template #message-danger>
            <div class="text-left">{{ errors.email }}</div>
          </template>
        </vs-input>
        <vs-input
          v-if="mode !== 'forgot'"
          type="password"
          v-model="data.password"
          :placeholder="$t('password')"
          @blur="validateField('password')"
        >
          <template #icon>
            <i class="bx bxs-lock"></i>
          </template>
          <template #message-danger>
            <div class="text-left">{{ errors.password }}</div>
          </template>
        </vs-input>
        <vs-input
          v-if="mode === 'register' || mode === 'reset'"
          type="password"
          v-model="data.confirmPassword"
          :placeholder="$t('confirmPassword')"
          @blur="validateField('confirmPassword')"
        >
          <template #icon>
            <i class="bx bxs-lock"></i>
          </template>
          <template #message-danger>
            <div class="text-left">{{ errors.confirmPassword }}</div>
          </template>
        </vs-input>
        <div v-show="mode !== 'forgot' && mode !== 'reset'" class="flex">
          <vs-checkbox v-model="data.remember">
            <template #icon> <i class="bx bx-check"></i> </template>
            {{ $t("rememberMe") }}
          </vs-checkbox>
          <a @click="mode = 'forgot'">{{ $t("forgotPassword") }}</a>
        </div>
      </div>

      <template #footer>
        <div v-if="mode === 'forgot'" class="footer-dialog">
          <vs-button
            block
            @click="forgotPassword"
            :disabled="forgotDisabled"
            :aria-label="$t('requestPasswordReset')"
            >{{ $t("requestPasswordReset") }}</vs-button
          >
        </div>
        <div v-else-if="mode === 'reset'" class="footer-dialog">
          <vs-button
            block
            @click="setPassword"
            :disabled="resetDisabled"
            :aria-label="$t('resetPassword')"
            >{{ $t("resetPassword") }}</vs-button
          >
        </div>
        <div v-else-if="mode === 'register'" class="footer-dialog">
          <vs-button
            block
            @click="signUp"
            :disabled="signUpDisabled"
            :aria-label="$t('signUp')"
            >{{ $t("signUp") }}</vs-button
          >

          <div class="new">
            {{ $t("existingUser")
            }}<a @click="mode = 'login'">{{ $t("signIn") }}</a>
          </div>
        </div>
        <div v-else class="footer-dialog">
          <vs-button
            block
            @click="signIn"
            :disabled="signInDisabled"
            :aria-label="$t('signIn')"
            >{{ $t("signIn") }}</vs-button
          >

          <div class="new">
            {{ $t("newUser")
            }}<a @click="mode = 'register'">{{ $t("createAccount") }}</a>
          </div>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({
    active: false,
    loading: false,
    data: {
      email: "",
      password: "",
      confirmPassword: "",
      remember: false,
      resetToken: "",
    },
    errors: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "login",
  }),
  computed: {
    ...mapState(["user"]),
    signInDisabled() {
      return !!(this.errors.email || this.errors.password);
    },
    signUpDisabled() {
      return !!(this.signInDisabled || this.errors.confirmPassword);
    },
    forgotDisabled() {
      return !!this.errors.email;
    },
    resetDisabled() {
      return !!(this.errors.password || this.errors.confirmPassword);
    },
  },
  mounted() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.password_reset) {
      this.active = true;
      this.mode = "reset";
      this.data.resetToken = params.password_reset;
    } else if (!this.user.email) this.active = true;
  },
  methods: {
    ...mapActions([
      "login",
      "register",
      "requestPasswordReset",
      "resetPassword",
    ]),
    signIn() {
      if (this.validateField("email") && this.validateField("password")) {
        this.loading = true;
        this.login(this.data).then(() => (this.active = false));
      }
    },
    signUp() {
      if (
        this.validateField("email") &&
        this.validateField("password") &&
        this.validateField("confirmPassword")
      ) {
        this.loading = true;
        this.register(this.data).then(() => (this.active = false));
      }
    },
    forgotPassword() {
      if (this.validateField("email")) {
        this.loading = true;
        this.requestPasswordReset(this.data).then(() => (this.active = false));
      }
    },
    setPassword() {
      if (
        this.validateField("password") &&
        this.validateField("confirmPassword")
      ) {
        this.loading = true;
        this.resetPassword(this.data).then(() => {
          this.mode = "login";
          this.loading = false;
        });
      }
    },
    validateField(field) {
      if (this.data[field] === "") {
        this.errors[field] = this.$t("fieldCannotBeEmpty");
        return false;
      } else {
        if (field === "email" && !/\S+@\S+\.\S+/.test(this.data[field])) {
          this.errors[field] = this.$t("fieldMustBeEmail");
          return false;
        }
        if (field === "password" && this.data[field].length < 8) {
          this.errors[field] = this.$t("passwordMinLength");
          return false;
        }
        if (
          field === "confirmPassword" &&
          this.data[field] !== this.data["password"]
        ) {
          this.errors[field] = this.$t("passwordsDontMatch");
          return false;
        }

        this.errors[field] = "";
        return true;
      }
    },
  },
  watch: {
    active: {
      handler() {
        this.data.email = "";
        this.data.password = "";
        this.data.confirmPassword = "";
        this.data.remember = false;

        this.errors.email = "";
        this.errors.password = "";
        this.errors.confirmPassword = "";

        if (this.mode !== "reset") this.mode = "login";
        this.loading = false;
      },
      immediate: true,
    },
    user: {
      handler(val) {
        if (val.email && this.mode !== "reset") {
          this.active = false;
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style lang="scss">
.not-margin {
  margin: 0px;
  font-weight: normal;
  padding: 10px;
}
.con-form {
  width: 100%;
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    a {
      font-size: 0.8rem;
      opacity: 0.7;
      &:hover {
        opacity: 1;
      }
    }
  }
  .vs-checkbox-label {
    font-size: 0.8rem;
  }
  .vs-input-content {
    margin: 10px 0px;
    width: calc(100%);
    .vs-input {
      width: 100%;
    }
  }
}
.footer-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: calc(100%);
  .new {
    margin: 0px;
    margin-top: 20px;
    padding: 0px;
    font-size: 0.7rem;
    a {
      color: rgba(var(--vs-primary), 1) !important;
      margin-left: 6px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .vs-button {
    margin: 0px;
  }
}
</style>
