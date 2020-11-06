<template>
  <div class="space-y-2">
    <ErrorHandler
      v-if="errors"
      :errors="errors"
    />
    <table class="balance-table">
      <thead>
        <tr>
          <th>Code</th>
          <th></th>
          <th>Description</th>
          <th>DR</th>
          <th>CR</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>51010</td>
          <td>Production - Labor Cost</td>
          <td>(Salary)</td>
          <td class="text-right">
            {{ production.salary | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>51010</td>
          <td>Production - Labor Cost</td>
          <td>(Salary - Retro)</td>
          <td class="text-right">
            {{ production.retro | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>51011</td>
          <td>Production - Labor Cost</td>
          <td>(OT)</td>
          <td class="text-right">
            {{ production.ot| currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>51021</td>
          <td>Production - Labor Cost</td>
          <td>(Accident)</td>
          <td class="text-right">
            {{ production.accident | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>51022</td>
          <td>Production - Labor Cost</td>
          <td>(Death)</td>
          <td class="text-right">
            {{ production.death | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>51023</td>
          <td>Production - Labor Cost</td>
          <td>(Medical)</td>
          <td class="text-right">
            {{ production.medical | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>51024</td>
          <td>Production - Labor Cost</td>
          <td>(Pension)</td>
          <td class="text-right">
            {{ production.pension | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>51030</td>
          <td>Production - Labor Cost</td>
          <td>(Posiotion / Functional)</td>
          <td class="text-right">
            {{ production.posfunc | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>51040</td>
          <td>Production - Labor Cost</td>
          <td>(Housing)</td>
          <td class="text-right">
            {{ production.housing | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>51050</td>
          <td>Production - Labor Cost</td>
          <td>(Transport)</td>
          <td class="text-right">
            {{ production.transport | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>51060</td>
          <td>Production - Labor Cost</td>
          <td>(Incentive)</td>
          <td class="text-right">
            {{ production.incentive | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>51080</td>
          <td>Production - Labor Cost</td>
          <td>(Meals)</td>
          <td class="text-right">
            {{ production.meals | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>51082</td>
          <td>Production - Labor Cost</td>
          <td>(Living)</td>
          <td class="text-right">
            {{ production.living | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>51091</td>
          <td>Production - Labor Cost</td>
          <td>(THR)</td>
          <td class="text-right">
            {{ production.thr | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>51093</td>
          <td>Production - Labor Cost</td>
          <td>(Communication)</td>
          <td class="text-right">
            {{ production.communication | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>51099</td>
          <td>Production - Labor Cost</td>
          <td>(Other Allowance Taxable)</td>
          <td class="text-right">
            {{ production.other | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>Production - Labor Cost</td>
          <td>(Tax 21 Returned)</td>
          <td class="text-right">
            {{ production.taxReturn | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>Production - Labor Cost</td>
          <td>(Pengembalian Pajak DTP)</td>
          <td class="text-right">
            {{ production.dtp | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr class="bg-blue-100">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td class="text-right">
            {{ journalBalance.totProduction | currency }}
          </td>
        </tr>
        <tr>
          <td>61001</td>
          <td>Payroll Exp - Administration</td>
          <td>(Salary)</td>
          <td class="text-right">
            {{ administration.salary | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>61001</td>
          <td>Payroll Exp - Administration</td>
          <td>(Salary - Retro)</td>
          <td class="text-right">
            {{ administration.retro | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>61002</td>
          <td>Payroll Exp - Administration</td>
          <td>(OT)</td>
          <td class="text-right">
            {{ administration.ot | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>61011</td>
          <td>Payroll Exp - Administration</td>
          <td>(Accident)</td>
          <td class="text-right">
            {{ administration.accident | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>61012</td>
          <td>Payroll Exp - Administration</td>
          <td>(Death)</td>
          <td class="text-right">
            {{ administration.death | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>61013</td>
          <td>Payroll Exp - Administration</td>
          <td>(Medical)</td>
          <td class="text-right">
            {{ administration.medical | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>61014</td>
          <td>Payroll Exp - Administration</td>
          <td>(Pension)</td>
          <td class="text-right">
            {{ administration.pension | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>61020</td>
          <td>Payroll Exp - Administration</td>
          <td>(Posiotion / Functional)</td>
          <td class="text-right">
            {{ administration.posfunc | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>61030</td>
          <td>Payroll Exp - Administration</td>
          <td>(Housing)</td>
          <td class="text-right">
            {{ administration.housing | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>61040</td>
          <td>Payroll Exp - Administration</td>
          <td>(Transport)</td>
          <td class="text-right">
            {{ administration.transport | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>61050</td>
          <td>Payroll Exp - Administration</td>
          <td>(Incentive)</td>
          <td class="text-right">
            {{ administration.incentive | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>61051</td>
          <td>Payroll Exp - Administration</td>
          <td>(Communication)</td>
          <td class="text-right">
            {{ administration.communication | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>61052</td>
          <td>Payroll Exp - Administration</td>
          <td>(Living)</td>
          <td class="text-right">
            {{ administration.living | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>61060</td>
          <td>Payroll Exp - Administration</td>
          <td>(Meals)</td>
          <td class="text-right">
            {{ administration.meals | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>61070</td>
          <td>Payroll Exp - Administration</td>
          <td>(THR)</td>
          <td class="text-right">
            {{ administration.thr | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>61090</td>
          <td>Payroll Exp - Administration</td>
          <td>(Other Allowance Taxable)</td>
          <td class="text-right">
            {{ administration.other | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>Production - Labor Cost</td>
          <td>(Tax 21 Returned)</td>
          <td class="text-right">
            {{ administration.taxReturn | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>Production - Labor Cost</td>
          <td>(Pengembalian Pajak DTP)</td>
          <td class="text-right">
            {{ administration.dtp | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr class="bg-blue-100">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td class="text-right">
            {{ journalBalance.totAdministration | currency }}
          </td>
        </tr>
        <tr>
          <td>21510</td>
          <td>Salaries Payable (Total Trf. by Mandiri)</td>
          <td></td>
          <td></td>
          <td class="text-right">
            {{ journalBalance.totMandiri | currency }}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>21510</td>
          <td>Salaries Payable (Total Final Pay)</td>
          <td></td>
          <td></td>
          <td class="text-right">
            {{ journalBalance.totFinalPay | currency }}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>21510</td>
          <td>Salaries Payable (Total Expatriat Salary)</td>
          <td></td>
          <td></td>
          <td class="text-right">
            {{ journalBalance.totExpat | currency }}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>21510</td>
          <td>Salaries Payable (Retro Pay)</td>
          <td></td>
          <td></td>
          <td class="text-right">
            {{ journalBalance.totRetroPay | currency }}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>21510</td>
          <td>Salaries Payable (Pemotongan Toolroom)</td>
          <td></td>
          <td></td>
          <td class="text-right">
            {{ journalBalance.totTool | currency }}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>21621</td>
          <td>Canteen</td>
          <td></td>
          <td></td>
          <td class="text-right">
            {{ journalBalance.totCanteen | currency }}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>21624</td>
          <td>Closing Advance (Dana Pinjaman)</td>
          <td></td>
          <td></td>
          <td class="text-right">
            {{ journalBalance.totLoan | currency }}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>21619</td>
          <td>Kopkar</td>
          <td></td>
          <td></td>
          <td class="text-right">
            {{ journalBalance.totKopkar | currency }}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>21512</td>
          <td>Astek Payable (BPJS Ketenagakerjaan)</td>
          <td></td>
          <td></td>
          <td class="text-right">
            {{ journalBalance.totKer | currency }}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>21512</td>
          <td>Astek Payable (BPJS Kesehatan)</td>
          <td></td>
          <td></td>
          <td class="text-right">
            {{ journalBalance.totKes | currency }}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>21310</td>
          <td>Tax Payable PPH 21</td>
          <td></td>
          <td></td>
          <td class="text-right">
            {{ journalBalance.totTax | currency }}
          </td>
          <td></td>
        </tr>
        <tr :class="[{ 'bg-green-100': journalBalance.tot3 === 0 }, 'bg-red-100']">
          <td></td>
          <td></td>
          <td><strong>TOTAL</strong></td>
          <td class="text-right">
            <strong>{{ journalBalance.tot1 | currency }}</strong>
          </td>
          <td class="text-right">
            <strong>{{ journalBalance.tot2 | currency }}</strong>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>51024</td>
          <td>Production - Labor Cost</td>
          <td>(Pension)</td>
          <td class="text-right">
            {{ journalBalance.pensionProd | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>61014</td>
          <td>Payroll Exp - Administration</td>
          <td>(Pension)</td>
          <td class="text-right">
            {{ journalBalance.pensionAdm | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr class="bg-blue-100">
          <td></td>
          <td></td>
          <td></td>
          <td class="text-right">
            {{ journalBalance.totPension | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>Gross</td>
          <td class="text-right">
            {{ journalBalance.totGross | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>Jurnal - Pensiun</td>
          <td class="text-right">
            {{ journalBalance.totJurnal | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr class="bg-blue-100">
          <td></td>
          <td></td>
          <td>Selisih</td>
          <td class="text-right">
            {{ journalBalance.totSelisih | currency }}
          </td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { JournalBalance } from '../../apollo/query/journal';

export default {
  data() {
    return {
      production: {},
      administration: {},
      journalBalance: {},
      errors: [],
    };
  },
  apollo: {
    journalBalance: {
      query: JournalBalance,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { production, administration } = data.journalBalance;
          this.production = production;
          this.administration = administration;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
