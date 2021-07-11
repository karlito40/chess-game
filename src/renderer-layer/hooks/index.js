import { inject } from 'vue'
import { LOGIC_LAYER } from '../constants'

export const useLogicLayer = () => inject(LOGIC_LAYER)