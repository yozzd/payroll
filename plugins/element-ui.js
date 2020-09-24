import Vue from 'vue';
import {
  Alert,
  Button,
  DatePicker,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Form,
  FormItem,
  Input,
  Message,
  MessageBox,
  Link,
  Option,
  Select,
  Table,
  TableColumn,
  Upload,
} from 'element-ui';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';

locale.use(lang);

Vue.use(Alert);
Vue.use(Button);
Vue.use(DatePicker);
Vue.use(Dialog);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Link);
Vue.use(Option);
Vue.use(Select);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Upload);

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
