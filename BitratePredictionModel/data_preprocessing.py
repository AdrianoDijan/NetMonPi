# -*- coding: utf-8 -*-
"""
Created on Tue Dec 15 12:43:05 2020

@author: Marko
"""
def PreprocessData():
    import numpy as np
    import pandas as pd
    #import matplotlib.pyplot as plt #maknuti poslije
    
    pd.set_option('mode.chained_assignment','raise')
    
    dataset = pd.read_json("C:\\Users\\Marko\\Desktop\\tr2.json",None,"frame")
    polling_time = dataset.loc[:,'time']
    transmit_bitrate_dataset = np.array(object=[],dtype=np.uint64)
    receive_bitrate_dataset = np.array(object=[],dtype=np.uint64)
    # =============================================================================
    # for i in range(0,len(polling_time)):
    #      #polling_time[i] = ((polling_time[i])[11:])[0:len(polling_time[i])-1]
    #      polling_time.iloc[i] = ((polling_time.iloc[i])[11:])[0:len(polling_time[i])-1]
    # =============================================================================
    
    # =============================================================================
    # test_str = (polling_time[0])[11:]
    # test_str = test_str[0:len(test_str)-1]
    # =============================================================================
    # =============================================================================
    # polling_time = dataset['time'].astype(np.datetime64,copy=True)
    # polling_time = polling_time.to_numpy(dtype=np.datetime64)
    # =============================================================================
         
    dataset = dataset.drop(['time'],axis=1)
    
    #handling NaN values
    # float(-1) will be the placeholder for NaN values
    dataset.fillna(value=np.float64(-1),method=None,axis=0,inplace=True)
    
    # counters are 32-bit or 64-bit
    # checking the size of counters
    # receive_bitrate_dataset[np.argmax(receive_bitrate_dataset[:,1]),1] == 4294904542
    # receive_bitrate_dataset[np.argmax(receive_bitrate_dataset[:,1])+1,1] == 4294904542
    # receive_bitrate_dataset[np.argmax(receive_bitrate_dataset[:,1])+2,1] == 2157907
    # interface polled in time = n, ifInOctets = 4294904542
    # interface polled in time = n+2, ifInOctets = 4294904542
    # interface polled in time = n+4, ifInOctets = 2157907
    # conclusion --> between time moments n+2 and n+4 counter reached value (2^32-1) and reseted and the value of counter was 2157907 at the time moment t = n+4
    # both counters are either 32-bit or 64-bit
    
    if (dataset['mean_txInOctets']).max() > 4294967296-1 and (dataset['mean_txOutOctets']).max() > 4294967296-1: #counters are 64-bit
        transmit_bitrate_dataset = dataset['mean_txOutOctets'].to_numpy(dtype=np.uint64)
        receive_bitrate_dataset = dataset['mean_txInOctets'].to_numpy(dtype=np.uint64)
    elif (dataset['mean_txInOctets']).max() <= 4294967296-1 and (dataset['mean_txOutOctets']).max() <= 4294967296-1: #counters are 32-bit
        transmit_bitrate_dataset = dataset['mean_txOutOctets'].to_numpy(dtype=np.uint32)
        receive_bitrate_dataset = dataset['mean_txInOctets'].to_numpy(dtype=np.uint32)
    else: # counters are not the same (assumption), condition just for the test case, counters can't differ in their size
        if (dataset['mean_txInOctets']).max() > 4294967296-1:
            transmit_bitrate_dataset = dataset['mean_txInOctets'].to_numpy(dtype=np.uint64)
            receive_bitrate_dataset = dataset['mean_txOutOctets'].to_numpy(dtype=np.uint32)
        else:
            receive_bitrate_dataset = dataset['mean_txInOctets'].to_numpy(dtype=np.uint64)
            transmit_bitrate_dataset = dataset['mean_txOutOctets'].to_numpy(dtype=np.uint32)
     
    #uint64 beacuse of adding polynomial features    
    transmit_bitrate_dataset = dataset['mean_txOutOctets'].to_numpy(dtype=np.uint64)
    receive_bitrate_dataset = dataset['mean_txInOctets'].to_numpy(dtype=np.uint64)
     
# =============================================================================
#     transmit_bitrate_dataset = dataset['mean_txOutOctets'].to_numpy(dtype=np.ulonglong)
#     receive_bitrate_dataset = dataset['mean_txInOctets'].to_numpy(dtype=np.ulonglong)    
#         
# =============================================================================
    # type((dataset['mean_txInOctets'])[0])
    # Out[27]: numpy.float64
    
    #transmit bitrate dataset --> 60 SNMP GET requests in a minute, 1 SNMP GET request per second, after 60 s arithmetic mean is calculated and that value is written to InfluxDB
    #feature will be num_of_seconds which elapsed since the start of the NIC associated with the interface
    transmit_bitrate_dataset = np.column_stack((np.array(range(0,len(transmit_bitrate_dataset)),dtype=transmit_bitrate_dataset.dtype),transmit_bitrate_dataset))
      
    #receive bitrate dataset --> #transmit bitrate dataset --> 60 SNMP GET requests in a minute, 1 SNMP GET request per second, after 60 s arithmetic mean is calculated and that value is written to InfluxDB 
    #feature will be num_of_seconds which elapsed since the start of the NIC associated with the interface
    receive_bitrate_dataset = np.column_stack((np.array(range(0,len(receive_bitrate_dataset)),dtype=receive_bitrate_dataset.dtype),receive_bitrate_dataset))
    
    #preparing datasets for ridge regression
    transmit_bitrate_dataset = np.stack(arrays=(transmit_bitrate_dataset[:,0],transmit_bitrate_dataset[:,0]**(2),transmit_bitrate_dataset[:,0]**(3),transmit_bitrate_dataset[:,0]**(4),transmit_bitrate_dataset[:,0]**(5),transmit_bitrate_dataset[:,1]),axis=1)
    receive_bitrate_dataset = np.stack(arrays=(receive_bitrate_dataset[:,0],receive_bitrate_dataset[:,0]**(2),receive_bitrate_dataset[:,0]**(3),receive_bitrate_dataset[:,0]**(4),receive_bitrate_dataset[:,0]**(5),receive_bitrate_dataset[:,1]),axis=1)
     
    #handling missing values for transmit_bitrate_dataset
    mask = (dataset.loc[:,'mean_txOutOctets'] != -1).to_numpy(dtype=bool)
    transmit_bitrate_dataset = transmit_bitrate_dataset[mask]
    
    # handling missing values for receive_bitrate_dataset
    mask = (dataset.loc[:,'mean_txInOctets'] != -1).to_numpy(dtype=bool)
    receive_bitrate_dataset = receive_bitrate_dataset[mask]
    
    transmit_bitrate_dataset_X = transmit_bitrate_dataset[:,1:6]
    transmit_bitrate_dataset_y = transmit_bitrate_dataset[:,5]
    
    receive_bitrate_dataset_X = receive_bitrate_dataset[:,1:6]
    receive_bitrate_dataset_y = receive_bitrate_dataset[:,5]
    
    #dataset is no longer needed
    del dataset
    
    #mask is no longer needed
    del mask
    
    # =============================================================================
    # #checking if the counter wraped during sampling of the interface
    # i = 0
    # for i in range(0,transmit_bitrate_dataset.shape[0]-1):
    #     if transmit_bitrate_dataset[i,1] > transmit_bitrate_dataset[i+1,1]: #counter wraped
    #        transmit_bitrate_dataset[i+1:(transmit_bitrate_dataset.shape[0]),1] =  transmit_bitrate_dataset[i+1:(transmit_bitrate_dataset.shape[0]),1] + transmit_bitrate_dataset[i,1]
    # =============================================================================
    
    # =============================================================================
    # X = transmit_bitrate_dataset[[range(0,(len(transmit_bitrate_dataset)))],[0]]
    # y = transmit_bitrate_dataset[[range(0,round(len(transmit_bitrate_dataset)))],[1]]
    # plt.plot(np.transpose(X),np.transpose(y))
    # plt.show()
    # =============================================================================
    
    # =============================================================================
    # X = receive_bitrate_dataset[[range(0,(len(receive_bitrate_dataset)))],[0]]
    # y = receive_bitrate_dataset[[range(0,round(len(receive_bitrate_dataset)))],[1]]
    plt.plot(np.transpose(receive_bitrate_dataset_X),np.transpose(receive_bitrate_dataset_y))
    plt.show() # counter for num of bytes in overflows faster --> more traffic coming in than out
    # =============================================================================
    return transmit_bitrate_dataset_X, transmit_bitrate_dataset_y, receive_bitrate_dataset_X, receive_bitrate_dataset_y