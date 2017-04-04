import _ from 'lodash';
import gnum from '../../../../../../helpers/global-enum';

module.exports = function getInitialForm() {
  return this.props.initialForm
    ? _.cloneDeep(this.props.initialForm)
    : _.cloneDeep(gnum.INITIAL_QUOTE_FORM);
};
