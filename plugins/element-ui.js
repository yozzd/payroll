import Vue from 'vue';
import {
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  DatePicker,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Form,
  FormItem,
  Input,
  Link,
  Loading,
  Menu,
  MenuItem,
  Message,
  MessageBox,
  Option,
  PageHeader,
  Pagination,
  Popover,
  Progress,
  Select,
  Submenu,
  Table,
  TableColumn,
  Tabs,
  TabPane,
  Upload,
} from 'element-ui';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';

locale.use(lang);

Vue.use(Alert);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Button);
Vue.use(Checkbox);
Vue.use(DatePicker);
Vue.use(Dialog);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Link);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Option);
Vue.use(PageHeader);
Vue.use(Pagination);
Vue.use(Popover);
Vue.use(Progress);
Vue.use(Select);
Vue.use(Submenu);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Upload);

Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
