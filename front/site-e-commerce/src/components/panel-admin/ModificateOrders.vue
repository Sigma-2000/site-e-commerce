<template>
    <div class="modificate-views">
        <div class="cart-modificate">
            <!--('all')-->
            <i18n-t keypath="panel-admin.consult-orders" tag="div" class="modificate-action">
                <template #consult
                    ><span @click="navigateToOrderManagement('all')" class="modificate-action-click"
                        ><strong>{{ $t('panel-admin.consult') }}</strong></span
                    ></template
                >
            </i18n-t>
            <i18n-t
                keypath="panel-admin.consult-orders-in-progress"
                tag="div"
                class="modificate-action"
            >
                <template #consult
                    ><span
                        @click="navigateToOrderManagement('in-progress')"
                        class="modificate-action-click"
                        ><strong>{{ $t('panel-admin.consult') }}</strong></span
                    ></template
                >
            </i18n-t>
            <i18n-t
                keypath="panel-admin.modificate-status-order"
                tag="div"
                class="modificate-action"
            >
                <template #modificate
                    ><span
                        @click="navigateToOrderManagement('in-progress')"
                        class="modificate-action-click"
                        ><strong>{{ $t('panel-admin.modificate') }}</strong></span
                    ></template
                >
            </i18n-t>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useOrdersStore } from '@/stores/ordersStore';

const router = useRouter();
const ordersStore = useOrdersStore();

const navigateToOrderManagement = (filterType) => {
    ordersStore.setFilterType(filterType);
    router.push('/panel-admin/orders');
};
</script>
