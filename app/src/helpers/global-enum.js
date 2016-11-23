module.exports = {
  PART_NUMBER_ID_PREFIX: 'part-number-select-',
  MACH_NUM_ID_PREFIX: 'machine-number-select-',
  PART_NUM_ID_PREFIX: 'part-number-select-',
  MACH_NUM_BLOCK_OBJ: { machNumChoice: 'default' },
  // MACH_NUM_BLOCKS_DEFAULT: [{ machNumChoice: 'default' }],
  PART_NUM_BLOCK_OBJ: { partNumChoice: 'default', quantity: 0 },
  PART_NUM_BLOCKS_DEFAULT: [{ partNumChoice: 'default', quantity: 0 }],
  INITIAL_PART_NUM_BLOCK: { 'default': 1 },
  INITIAL_MACH_NUM_BLOCK: { 'default': { 0: { 'default': 1 } } },
  INITIAL_QUOTE_FORM: { 0: { 'default': { 0: { 'default': 1 } } } }
}