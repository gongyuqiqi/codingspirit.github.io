---
title: 'Android: BLE Operations'
top: false
tags:
  - Android
  - Java
date: 2020-07-05 14:52:04
categories: App Development
---

When I was in university, I had developed a BLE based UAV controller based on an open source Android BLE library. The library itself is quite easy to use but I decided to develop an Android BLE app with native Android BLE API, which can connect and communicate with BLE GATT devices.

<!--more-->

## Permissions

```xml
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

> Note: ACCESS_FINE_LOCATION are required for BT scanning after Android 9

## Request to open Bluetooth

```java
private BluetoothAdapter mBluetoothAdapter;
private BluetoothManager mBluetoothManager;

mBluetoothManager = (BluetoothManager) getActivity().getSystemService(Context.BLUETOOTH_SERVICE);
mBluetoothAdapter = mBluetoothManager.getAdapter();

if (mBluetoothAdapter == null || !mBluetoothAdapter.isEnabled()) {
    Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
    startActivity(enableBtIntent);
}
```

## BLE Scan

If there is no need to set scan filter, we can simply do:


```java
ScanCallback mScanCallback = new ScanCallback() {
    @Override
    public void onScanResult(int callbackType, ScanResult result) {
        super.onScanResult(callbackType, result);
        if (result != null) {
           devicesList.add(result.getDevice());
        }
    }
};
mBluetoothAdapter.getBluetoothLeScanner().startScan(mScanCallback);
```

If we want add filter for scanner, i.e. We'd like to search devices with certain service:

```java
static final String SERVICE_UUID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
ParcelUuid parcelUuidMask = ParcelUuid.fromString(SERVICE_UUID);
List<ScanFilter> filters = new ArrayList<>();
ScanFilter.Builder filterBuilder = new ScanFilter.Builder().setServiceUuid(parcelUuidMask);
filters.add(filterBuilder.build());
ScanSettings.Builder settingBuilder = new ScanSettings.Builder();
mFragmentReference.get().mBluetoothAdapter.getBluetoothLeScanner().startScan(filters, settingBuilder.build(), mScanCallback);
```

## Connect to device

Blow code shows how to connect to device and set up callbacks:


```java
private static final UUID mServiceUuid = UUID.fromString(SERVICE_UUID);
private static final int REQUEST_MTU = 64;
// Get from ScanCallback: result.getDevice();
private BluetoothDevice mDevice;


mDeviceGatt = mDevice.connectGatt(mContext, false, new BluetoothGattCallback() {
    @Override
    public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
        switch (newState) {
            case BluetoothProfile.STATE_CONNECTED:
                // If connected we start to discover services provided by device
                gatt.discoverServices();
                break;
            case BluetoothProfile.STATE_CONNECTING:
                break;
            case BluetoothProfile.STATE_DISCONNECTED:
            default:
                gatt.close();
        }
    }

    @Override
    public void onServicesDiscovered(BluetoothGatt gatt, int status) {
        if (gatt.getService(mServiceUuid) != null) {
            // service found, request for increasing MTU
            gatt.requestMtu(REQUEST_MTU);
        }
    }

    @Override
    public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
        if (status == BluetoothGatt.GATT_SUCCESS) {
            Log.d(TAG, "Read characteristic: " + new String(characteristic.getValue()));
        }
    }

    @Override
    public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
        if (status == BluetoothGatt.GATT_SUCCESS) {
            Log.d(TAG, "Write characteristic: " + new String(characteristic.getValue()));
        }
    }

    @Override
    public void onMtuChanged(BluetoothGatt gatt, int mtu, int status) {
        Log.d(TAG, "MTU changed to " + mtu);
    }
});
```

The default MTU for ATT is 23 bytes. In those 23 bytes, there are 20 bytes for GATT. To send/receive data more than 20 bytes at once, we need to call `requestMtu` to increase MTU.

## Read/Write characteristic

Blow code shows how to read characteristic:

```java
// Here we get all available characteristics in this service
List<BluetoothGattCharacteristic> characteristics = gatt.getService(mServiceUuid).getCharacteristics();

// Try to read the first characteristic
if (!mThing.mDeviceGatt.readCharacteristic(characteristics.get(0))) {
    Log.e("TAG", "Read characteristic error");
}
```

Blow code shows how to write characteristic:

```java
private static final UUID mCharacteristicUuid = UUID.fromString("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");

BluetoothGattCharacteristic characteristic = gatt.getService(mServiceUuid).getCharacteristic(mCharacteristicUuid);

characteristic.setValue();
mDeviceGatt.writeCharacteristic("data to write".getBytes());
```

Once operation is done, `onCharacteristicRead` / `onCharacteristicWrite` will be called.

> Note: There is only one operation is allowed at a time. If we need to implement a complex logic with a lot of read/write operations, suggestion will be use a message queue.
